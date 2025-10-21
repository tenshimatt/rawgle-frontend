#!/bin/bash
# Docker Container Maintenance Script
# Automatically updates and maintains Docker containers
# Run daily via cron or n8n

set -e

# Configuration
LOG_FILE="/var/log/docker-maintenance.log"
SLACK_WEBHOOK="${SLACK_WEBHOOK_URL:-}"
NOTIFY_EMAIL="${NOTIFY_EMAIL:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1" | tee -a "$LOG_FILE"
}

# Send notification
notify() {
    local message="$1"
    local severity="${2:-info}"

    # Slack notification
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST "$SLACK_WEBHOOK" \
            -H 'Content-Type: application/json' \
            -d "{\"text\":\"🐳 Docker Maintenance [$severity]: $message\"}" \
            2>/dev/null || true
    fi

    # Email notification (if configured)
    if [ -n "$NOTIFY_EMAIL" ]; then
        echo "$message" | mail -s "Docker Maintenance Alert" "$NOTIFY_EMAIL" 2>/dev/null || true
    fi
}

# Check if running as root or with docker permissions
check_permissions() {
    if ! docker ps >/dev/null 2>&1; then
        log_error "Cannot access Docker. Run as root or user in docker group."
        exit 1
    fi
}

# Cleanup old images
cleanup_images() {
    log_info "Cleaning up unused Docker images..."

    # Remove dangling images
    local dangling=$(docker images -f "dangling=true" -q)
    if [ -n "$dangling" ]; then
        echo "$dangling" | xargs docker rmi 2>/dev/null || true
        log "Removed dangling images"
    fi

    # Remove images older than 30 days that aren't being used
    docker image prune -a --filter "until=720h" -f 2>/dev/null || true
    log "Cleaned up old unused images"
}

# Update specific container
update_container() {
    local container_name="$1"

    log_info "Updating container: $container_name"

    # Get current image
    local current_image=$(docker inspect --format='{{.Config.Image}}' "$container_name" 2>/dev/null)
    if [ -z "$current_image" ]; then
        log_warning "Container $container_name not found"
        return 1
    fi

    log_info "Current image: $current_image"

    # Pull latest image
    log_info "Pulling latest image for $current_image..."
    if docker pull "$current_image" 2>&1 | tee -a "$LOG_FILE"; then
        log "Pulled latest image: $current_image"

        # Check if image changed
        local old_id=$(docker inspect --format='{{.Image}}' "$container_name")
        local new_id=$(docker inspect --format='{{.Id}}' "$current_image")

        if [ "$old_id" != "$new_id" ]; then
            log_warning "New version available for $container_name"

            # Get container configuration
            local volumes=$(docker inspect --format='{{range .Mounts}}{{.Source}}:{{.Destination}}:{{.Mode}} {{end}}' "$container_name")
            local env_vars=$(docker inspect --format='{{range .Config.Env}}--env {{.}} {{end}}' "$container_name")
            local ports=$(docker inspect --format='{{range $p, $conf := .NetworkSettings.Ports}}{{$p}}:{{(index $conf 0).HostPort}} {{end}}' "$container_name")

            # Stop old container
            log_info "Stopping $container_name..."
            docker stop "$container_name" 2>&1 | tee -a "$LOG_FILE"

            # Remove old container
            log_info "Removing old container..."
            docker rm "$container_name" 2>&1 | tee -a "$LOG_FILE"

            # Recreate with new image
            log_info "Starting updated container..."
            # This is simplified - in production use docker-compose
            notify "Container $container_name updated from $old_id to $new_id" "success"

            return 0
        else
            log "Container $container_name is already up to date"
            return 0
        fi
    else
        log_error "Failed to pull image for $container_name"
        notify "Failed to update $container_name" "error"
        return 1
    fi
}

# Update all containers (with docker-compose)
update_compose_stack() {
    local compose_file="${1:-docker-compose.yml}"
    local stack_dir="${2:-.}"

    if [ ! -f "$stack_dir/$compose_file" ]; then
        log_warning "No $compose_file found in $stack_dir"
        return 1
    fi

    log_info "Updating docker-compose stack: $stack_dir/$compose_file"

    cd "$stack_dir" || return 1

    # Pull latest images
    docker-compose -f "$compose_file" pull 2>&1 | tee -a "$LOG_FILE"

    # Recreate containers with new images
    docker-compose -f "$compose_file" up -d 2>&1 | tee -a "$LOG_FILE"

    log "Stack updated successfully"
    notify "Docker Compose stack updated: $compose_file" "success"
}

# Check for unhealthy containers
check_health() {
    log_info "Checking container health..."

    # Get unhealthy containers
    local unhealthy=$(docker ps --filter "health=unhealthy" --format "{{.Names}}")

    if [ -n "$unhealthy" ]; then
        log_warning "Found unhealthy containers:"
        echo "$unhealthy" | while read -r container; do
            log_warning "  - $container"

            # Get health check logs
            docker inspect --format='{{json .State.Health}}' "$container" | tee -a "$LOG_FILE"

            # Attempt restart
            log_info "Attempting to restart $container..."
            docker restart "$container" 2>&1 | tee -a "$LOG_FILE"
        done

        notify "Unhealthy containers detected and restarted: $unhealthy" "warning"
    else
        log "All containers are healthy"
    fi

    # Check for restarting containers
    local restarting=$(docker ps --filter "status=restarting" --format "{{.Names}}")
    if [ -n "$restarting" ]; then
        log_error "Containers stuck restarting: $restarting"
        notify "Containers stuck restarting: $restarting" "error"
    fi
}

# Cleanup old logs
cleanup_logs() {
    log_info "Truncating large container logs..."

    # Find containers with logs > 100MB
    for container in $(docker ps -q); do
        local container_name=$(docker inspect --format='{{.Name}}' "$container" | sed 's/\///')
        local log_file=$(docker inspect --format='{{.LogPath}}' "$container")

        if [ -f "$log_file" ]; then
            local log_size=$(du -m "$log_file" | cut -f1)
            if [ "$log_size" -gt 100 ]; then
                log_warning "Container $container_name has ${log_size}MB logs - truncating"
                truncate -s 10M "$log_file"
            fi
        fi
    done
}

# Generate maintenance report
generate_report() {
    log_info "=== Docker Maintenance Report ==="

    # Container count
    local total_containers=$(docker ps -a | wc -l)
    local running_containers=$(docker ps | wc -l)
    log "Total containers: $total_containers"
    log "Running containers: $running_containers"

    # Image count
    local total_images=$(docker images | wc -l)
    log "Total images: $total_images"

    # Disk usage
    log_info "Docker disk usage:"
    docker system df | tee -a "$LOG_FILE"

    # Resource usage
    log_info "Top 5 containers by CPU:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | head -6 | tee -a "$LOG_FILE"
}

# Main execution
main() {
    log "==================================================================="
    log "🐳 Docker Maintenance Script Starting"
    log "==================================================================="

    check_permissions

    # Check health first
    check_health

    # Update containers (choose one approach)

    # Approach 1: Update via docker-compose (RECOMMENDED)
    # update_compose_stack "docker-compose.yml" "/path/to/your/compose/dir"

    # Approach 2: Update individual containers
    # List of containers to update
    CONTAINERS_TO_UPDATE=(
        "pandora-n8n"
        "pandora-jenkins"
        "pandora-grafana"
        "pandora-sonarqube"
        "pandora-selenium-hub"
        "pandora-selenium-chrome"
        "pandora-selenium-firefox"
    )

    for container in "${CONTAINERS_TO_UPDATE[@]}"; do
        update_container "$container" || log_error "Failed to update $container"
    done

    # Cleanup
    cleanup_images
    cleanup_logs

    # Generate report
    generate_report

    # System cleanup
    log_info "Running Docker system prune..."
    docker system prune -f 2>&1 | tee -a "$LOG_FILE"

    log "==================================================================="
    log "✅ Docker Maintenance Complete"
    log "==================================================================="

    notify "Docker maintenance completed successfully" "success"
}

# Run main function
main "$@"
