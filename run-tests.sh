#!/bin/bash

# Test Runner Script for Release Checklist Tool
# This script runs all backend and frontend tests

echo "========================================="
echo "  Release Checklist Tool - Test Suite"
echo "========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
BACKEND_STATUS=0
FRONTEND_STATUS=0

# Function to print section headers
print_section() {
    echo ""
    echo "========================================="
    echo "  $1"
    echo "========================================="
    echo ""
}

# Backend Tests
print_section "Running Backend Tests"
cd backend || exit 1

echo "Starting backend tests..."
bun test
BACKEND_STATUS=$?

if [ $BACKEND_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ Backend tests passed${NC}"
else
    echo -e "${RED}✗ Backend tests failed${NC}"
fi

cd ..

# Frontend Tests
print_section "Running Frontend Tests"
cd frontend || exit 1

echo "Starting frontend tests..."
bun test run
FRONTEND_STATUS=$?

if [ $FRONTEND_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend tests passed${NC}"
else
    echo -e "${RED}✗ Frontend tests failed${NC}"
fi

cd ..

# Summary
print_section "Test Summary"

if [ $BACKEND_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ Backend: PASSED${NC}"
else
    echo -e "${RED}✗ Backend: FAILED${NC}"
fi

if [ $FRONTEND_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend: PASSED${NC}"
else
    echo -e "${RED}✗ Frontend: FAILED${NC}"
fi

echo ""

# Overall result
if [ $BACKEND_STATUS -eq 0 ] && [ $FRONTEND_STATUS -eq 0 ]; then
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}  ✓ ALL TESTS PASSED${NC}"
    echo -e "${GREEN}=========================================${NC}"
    exit 0
else
    echo -e "${RED}=========================================${NC}"
    echo -e "${RED}  ✗ SOME TESTS FAILED${NC}"
    echo -e "${RED}=========================================${NC}"
    exit 1
fi
