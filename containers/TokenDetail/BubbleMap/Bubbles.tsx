'use client';

import { PixiUtils } from './pixi.utils';
import { Circle } from './bubbles.types';
import * as PIXI from 'pixi.js';
import React, { useEffect, useMemo, useState } from 'react';
import { BubblesUtils, appConfig } from './bubbles.utils';
import { Data } from './bubbles.types';
import { Spinner } from '@chakra-ui/react';

type Props = {
  coins: Data[];
};

const { width, height, maxCircleSize, minCircleSize } = appConfig;

export default function Bubbles({ coins = [] }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [circles, setCircles] = useState<Circle[] | null>(null);

  const appRef = React.useRef<HTMLDivElement>(null);

  const scalingFactor = useMemo(() => {
    return BubblesUtils.getScalingFactor(coins);
  }, [coins]);

  useEffect(() => {
    if (coins) {
      const scalingFactor = BubblesUtils.getScalingFactor(coins);
      const shapes = BubblesUtils.generateCircles(coins, scalingFactor);
      setCircles(shapes);
    }
  }, [coins]);

  useEffect(() => {
    if (!circles || !appRef.current) return;
    const imageSprites: PIXI.Sprite[] = [];
    const textSprites: PIXI.Text[] = [];
    const text2Sprites: PIXI.Text[] = [];
    const circleGraphics: PIXI.Sprite[] = [];

    const app = new PIXI.Application({
      width,
      height,
      backgroundColor: '#0b0517',
    });

    const renderer = PIXI.autoDetectRenderer({ view: app.view });
    renderer.resize(width, height);

    window.addEventListener('resize', () => {
      const _w = typeof window !== 'undefined' ? window.innerWidth * 0.65 : 100;
      const _h =
        typeof window !== 'undefined' ? window.innerHeight * 0.65 : 100;
      renderer.resize(_w, _h);
    });

    const appContainer = appRef.current;
    //@ts-expect-error
    appContainer?.appendChild((app as { view: Node }).view);
    appContainer?.children[0].addEventListener('click', (e: unknown) =>
      BubblesUtils.handleEmptySpaceClick(e as MouseEvent, circles),
    );

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];

      const container = PixiUtils.createContainer(circle);

      const circleGraphic = new PIXI.Sprite(
        PixiUtils.createGradientTexture(circle.radius * 4, ''),
      );
      circleGraphic.anchor.set(0.5);
      circleGraphic.name = 'circle';
      circleGraphics.push(circleGraphic);
      container.addChild(circleGraphic);

      container.onmouseenter = function () {
        const hoverTexture = PixiUtils.createGradientTexture(
          circle.radius * 4,
          'rgba(101, 54, 163, 0.8)',
          true,
        );
        circleGraphic.texture = hoverTexture;
        this.alpha = 1;
      };

      container.onmouseleave = function () {
        const notHoverTexture = PixiUtils.createGradientTexture(
          circle.radius * 4,
          'rgba(101, 54, 163, 0.8)',
          false,
        );
        circleGraphic.texture = notHoverTexture;
        this.alpha = 0.8;
      };

      container.onclick = function () {};

      // Create the text
      const text = PixiUtils.createText(circle);
      container.addChild(text);
      textSprites.push(text);

      const text2 = PixiUtils.createText2(circle);
      container.addChild(text2);
      text2Sprites.push(text2);

      (app as PIXI.Application<PIXI.ICanvas>).stage.addChild(container);
    }

    const ticker = BubblesUtils.update(
      circles,
      imageSprites,
      textSprites,
      text2Sprites,
      circleGraphics,
    );
    setTimeout(() => {
      (app as PIXI.Application<PIXI.ICanvas>).ticker.add(ticker);
      setIsLoading(false);
    }, 200);

    return () => {
      (app as PIXI.Application<PIXI.ICanvas>).ticker.remove(ticker);
      //   window.removeEventListener('resize', handleResize);
      // (app as PIXI.Application<PIXI.ICanvas>).destroy(true, true);
      appContainer?.children[0]?.removeEventListener('click', (e: unknown) =>
        BubblesUtils.handleEmptySpaceClick(e as MouseEvent, circles),
      );
    };
  }, [circles]);

  useEffect(() => {
    if (circles) {
      const max = maxCircleSize;
      const min = minCircleSize;

      circles.forEach((circle) => {
        if (!circle.proportion) return;

        const radius = Math.abs(Math.floor(circle.proportion * scalingFactor));
        circle.targetRadius = radius > max ? max : radius > min ? radius : min;
        circle.color = 'rgba(101, 54, 163, 0.8)';
      });
    }
  }, [coins, circles, scalingFactor]);

  return (
    <div className="flex rounded px-2 overflow-hidden bg-zinc-900 md:flex-col flex-col-reverse">
      <div
        className="bg-zinc-900 w-full overflow-hidden border-2 rounded border-gray-800"
        ref={appRef}
      ></div>
      {isLoading && <Spinner />}
    </div>
  );
}
