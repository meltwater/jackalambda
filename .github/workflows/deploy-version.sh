#!/bin/bash

# Default values
BRANCH="develop"
ENVIRONMENT="staging"  # Default to staging

# Parse command-line options
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --version)
            if [[ -z "$2" || "$2" == "--"* ]]; then
                echo "Please enter the version number to deploy:"
                read -r VERSION
            else
                VERSION="$2"
                shift
            fi
            ;;
        --env|--environment) ENVIRONMENT="$2"; shift ;;
        --branch) BRANCH="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# Ensure a version is provided if the environment is production
if [[ "$ENVIRONMENT" == "production" && -z "$VERSION" ]]; then
    echo "Error: A version must be specified for production deployments. If you want to automatically use the version from the package.json, use the '---version package.json' option."
    exit 1
fi

# Handle the case where the version is "package.json" - this forces version to be taken from package.json file
if [[ "$VERSION" == "package.json" ]]; then
    if [ -f "../../package.json" ]; then
        VERSION=$(jq -r '.version' package.json)
        echo "Using version from package.json: $VERSION"
    else
        echo "Error: package.json not found."
        exit 1
    fi
fi

# Get version from package.json if not provided
if [ -z "$VERSION" ]; then
    if [ -f "../../package.json" ]; then
        VERSION=$(jq -r '.version' package.json)
        echo "Version not specified. Using version from package.json: $VERSION"
    else
        echo "Error: package.json not found and version not specified."
        exit 1
    fi
fi

# Ensure the environment is valid
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo "Invalid environment: $ENVIRONMENT. Must be 'staging' or 'production'."
    exit 1
fi

# Normalize version tag
if [[ "$VERSION" != v* ]]; then
    VERSION="v$VERSION"
fi

echo "Version tag: $VERSION"

# Trigger the workflow_dispatch event using the GitHub CLI
gh workflow run deploy.yml \
  --ref "$BRANCH" \
  -f version="$VERSION" \
  -f environment="$ENVIRONMENT"