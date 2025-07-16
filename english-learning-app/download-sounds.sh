#!/bin/bash

# 创建sounds目录
mkdir -p public/sounds

# 下载音效文件
curl -L "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3" -o public/sounds/flip.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" -o public/sounds/match.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3" -o public/sounds/success.mp3

echo "音效文件下载完成！" 