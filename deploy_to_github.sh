#!/bin/bash

echo "Smart Resume Screener - GitHub Deployment Script"
echo "================================================="

echo ""
echo "This script will help you deploy your project to GitHub."
echo "Please make sure you have created a repository named 'smart-resume-screener' on GitHub first."
echo ""

read -p "Press Enter to continue..."

echo ""
echo "Adding remote origin..."
cd "c:\Users\PIYUSH TORAWANE\Smart resume scanner"
git remote add origin https://github.com/piyushtorawane/smart-resume-screener.git

echo ""
echo "Setting main branch..."
git branch -M main

echo ""
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "Deployment complete! Please check your GitHub repository."
echo "If you encountered authentication issues, please refer to GITHUB_DEPLOYMENT_INSTRUCTIONS.md"