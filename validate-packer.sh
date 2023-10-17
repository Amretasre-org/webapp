#!/bin/bash

if ! packer validate packer/; then
  echo "Packer file contains configuration errors. Please fix the issues."
  exit 1
else
  echo "Packer configuration is valid."
fi
