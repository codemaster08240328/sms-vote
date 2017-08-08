#!/bin/bash
mongoimport --db test --collection votesources --type json --file testData.json --jsonArray