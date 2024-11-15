'use client';

import { shortenAddress } from '@/utils/address';
import { Circle } from './bubbles.types';
import * as PIXI from 'pixi.js';

const gradientTextureCache: Map<string, PIXI.Texture> = new Map();

export class PixiUtils {
  static createContainer = (circle: Circle) => {
    const container = new PIXI.Container();
    container.position.set(circle.x, circle.y);
    container.hitArea = new PIXI.Circle(0, 0, circle.targetRadius);
    container.eventMode = 'dynamic';
    container.alpha = 0.8;
    return container;
  };

  static createImageSprite = (circle: Circle) => {
    const imgUrl = `/assets/coins/${circle.id}.${'png'}`;

    const imageSprite = PIXI.Sprite.from(imgUrl);
    const isFullSize = circle.radius * 0.3 < 10;

    imageSprite.anchor.set(0.5);
    imageSprite.width = circle.radius * (isFullSize ? 1.2 : 0.5);
    imageSprite.height = circle.radius * (isFullSize ? 1.2 : 0.5);
    imageSprite.position = { x: 0, y: isFullSize ? 0 : -circle.radius / 2 };
    return imageSprite;
  };

  static createText = (circle: Circle) => {
    const fontSize = circle.radius * 0.03;
    const isTextVisible = fontSize > 10;

    const textStyle = new PIXI.TextStyle({
      fontSize: isTextVisible ? fontSize + 'px' : 0,
      fill: '#ffffff',
    });

    const text = new PIXI.Text(shortenAddress(circle.id, 4), textStyle);
    text.anchor.set(0.5);
    text.position.y = 0.15 * circle.radius;
    return text;
  };

  static createText2 = (circle: Circle) => {
    const fontSize = circle.radius * 0.3;
    const isTextVisible = fontSize > 10;

    const text2Style = new PIXI.TextStyle({
      fontSize: isTextVisible ? fontSize + 'px' : 0,
      fill: '#ffffff',
    });

    const data = circle.proportion
      ? circle.proportion!.toFixed(2) + '%'
      : 'No data';

    const text2 = new PIXI.Text(data, text2Style);
    text2.anchor.set(0.5);
    text2.position.y = circle.radius / 1.5;
    circle['text2'] = text2;

    return text2;
  };

  static createGradientTexture(
    radius: number,
    color: string,
    isHover = false,
  ): PIXI.Texture {
    const textureKey: string = `${radius}_${color}_${
      isHover ? 'hover' : 'not_hover'
    }`;

    if (gradientTextureCache.has(textureKey)) {
      return gradientTextureCache.get(textureKey)!;
    }

    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = radius;
    canvas.height = radius;
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (context) {
      context.fillStyle = 'rgba(101, 54, 163, 0.8)';
      context.beginPath();
      context.arc(radius / 2, radius / 2, radius / 2 / 2, 0, Math.PI * 2);
      context.fill();
      context.lineWidth = 3;
      context.strokeStyle = isHover ? '#ffffff' : '#462671';
      context.stroke();

      // Create a PIXI texture from the canvas
      const texture: PIXI.Texture = PIXI.Texture.from(canvas);

      // Cache the texture for future use
      gradientTextureCache.set(textureKey, texture);

      return texture;
    }

    return PIXI.Texture.from(canvas);
  }
}
