pipeline {
    agent any
    
    environment {
        REGISTRY_URL = 'ghcr.io'
        IMAGE_NAME = sh(script: 'echo $GIT_URL | sed -E "s/.*[:\\/]([^\\/]+\\/[^\\/]+)\\.git$/\\1/"', returnStdout: true).trim()
        IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
        IMAGE_URL = "${REGISTRY_URL}/${IMAGE_NAME}:${IMAGE_TAG}"

        BRANCH_NAME = "${GIT_BRANCH.split("/")[1]}"
        APP_NAME = sh(script: 'echo $GIT_URL | sed -E "s/.*[:\\/]([^\\/]+\\/[^\\/]+)\\.git$/\\1/" | tr "/" "-"', returnStdout: true).trim()
        CONTAINER_NAME = "${APP_NAME}-${BRANCH_NAME}"
    }

    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Image') {
            steps {
                script {
                    docker.build(env.IMAGE_URL)
                }
            }
        }
        
        stage('Push Image') {
            steps {
                script {
                    docker.withRegistry('https://ghcr.io', 'ghcr') {
                        docker.image(env.IMAGE_URL).push()
                        docker.image(env.IMAGE_URL).push("latest")
                    }
                }
            }
        }

        stage('Remove Container') {
            steps {
                script {
                    sh "docker rm -f ${env.CONTAINER_NAME} || true"
                }
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    sh "docker create \
                        --name ${env.CONTAINER_NAME} \
                        --restart always \
                        --network proxy \
                        --volume /mnt/docker/services/dimigoin-${env.BRANCH_NAME}/back/.env:/app/.env \
                        --label io.portainer.accesscontrol.teams=din \
                        ${env.IMAGE_URL}"
                    sh "docker network connect dimigoin-${env.BRANCH_NAME} ${env.CONTAINER_NAME}"
                    sh "docker start ${env.CONTAINER_NAME}"
                }
            }
        }
    }
}
