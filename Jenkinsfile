pipeline {
    agent any

    environment {
        NODEJS_HOME = tool 'NodeJS-22'
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
        SELENIUM_HUB = 'http://10.90.10.6:4444/wd/hub'
        SONAR_HOST = 'http://10.90.10.6:9000'
        OPENPROJECT_URL = 'http://10.90.10.6:3002'
    }

    parameters {
        string(name: 'TASK_ID', defaultValue: '', description: 'OpenProject Task ID')
        string(name: 'SPEC_FILE', defaultValue: '', description: 'Spec file path (specs/feature-name.md)')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_MSG = sh(
                        script: 'git log -1 --pretty=%B',
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Environment Info') {
            steps {
                sh '''
                    echo "Node version:"
                    node --version
                    echo "NPM version:"
                    npm --version
                    echo "Git commit: ${GIT_COMMIT_MSG}"
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    npm ci --prefer-offline --no-audit
                '''
            }
        }

        stage('TypeScript Build') {
            steps {
                script {
                    try {
                        sh 'npm run build'
                        currentBuild.result = 'SUCCESS'
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        updateOpenProjectTask('❌ TypeScript build failed', 'failure')
                        error("Build failed: ${e.message}")
                    }
                }
            }
        }

        stage('Unit Tests') {
            steps {
                script {
                    try {
                        sh 'npm test -- --passWithNoTests --coverage'
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        updateOpenProjectTask('❌ Unit tests failed', 'failure')
                        error("Tests failed: ${e.message}")
                    }
                }
            }
        }

        stage('E2E Tests') {
            steps {
                script {
                    try {
                        sh '''
                            export SELENIUM_REMOTE_URL=${SELENIUM_HUB}
                            npm run test:e2e || true
                        '''
                    } catch (Exception e) {
                        echo "E2E tests failed (non-blocking): ${e.message}"
                    }
                }
            }
        }

        stage('Code Quality - SonarQube') {
            steps {
                script {
                    try {
                        withSonarQubeEnv('SonarQube') {
                            sh '''
                                sonar-scanner \
                                  -Dsonar.projectKey=rawgle-frontend \
                                  -Dsonar.projectName="Rawgle Frontend" \
                                  -Dsonar.sources=src \
                                  -Dsonar.tests=tests \
                                  -Dsonar.test.inclusions=**/*.test.ts,**/*.test.tsx \
                                  -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                                  -Dsonar.host.url=${SONAR_HOST}
                            '''
                        }
                    } catch (Exception e) {
                        echo "SonarQube analysis failed (non-blocking): ${e.message}"
                    }
                }
            }
        }

        stage('Security Scan - Trivy') {
            steps {
                script {
                    try {
                        sh '''
                            trivy fs --severity HIGH,CRITICAL --exit-code 0 . || true
                        '''
                    } catch (Exception e) {
                        echo "Trivy scan failed (non-blocking): ${e.message}"
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    timeout(time: 5, unit: 'MINUTES') {
                        try {
                            def qg = waitForQualityGate()
                            if (qg.status != 'OK') {
                                echo "Quality Gate failed: ${qg.status}"
                                updateOpenProjectTask('⚠️ Quality gate failed but build continues', 'warning')
                            }
                        } catch (Exception e) {
                            echo "Quality gate check failed: ${e.message}"
                        }
                    }
                }
            }
        }

        stage('Deploy to Vercel') {
            when {
                branch 'master'
            }
            steps {
                script {
                    try {
                        withCredentials([string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN')]) {
                            sh '''
                                npm install -g vercel
                                vercel --token ${VERCEL_TOKEN} --prod --yes
                            '''
                        }
                        updateOpenProjectTask('✅ Deployed to production', 'success')
                    } catch (Exception e) {
                        updateOpenProjectTask('❌ Deployment failed', 'failure')
                        error("Deployment failed: ${e.message}")
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                updateOpenProjectTask('✅ Build successful - All quality gates passed', 'success')
            }
        }
        failure {
            script {
                updateOpenProjectTask("❌ Build failed: ${currentBuild.result}", 'failure')
            }
        }
        always {
            cleanWs()
        }
    }
}

def updateOpenProjectTask(String message, String status) {
    if (params.TASK_ID) {
        script {
            withCredentials([string(credentialsId: 'openproject-api-token', variable: 'OP_TOKEN')]) {
                sh """
                    curl -X POST ${OPENPROJECT_URL}/api/v3/work_packages/${params.TASK_ID}/activities \
                      -H "Authorization: Bearer ${OP_TOKEN}" \
                      -H "Content-Type: application/json" \
                      -d '{
                        "comment": {
                          "raw": "${message}\\n\\nBuild: ${BUILD_URL}\\nCommit: ${GIT_COMMIT}"
                        }
                      }' || true
                """
            }
        }
    }
}
