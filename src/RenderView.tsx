import * as React from "react";
import {forwardRef, Ref, useEffect, useImperativeHandle, useRef} from "react";
import * as PIXI from "pixi.js";
import {Func, interpret} from "./interpreter";

type Props = {
  funcs: Func[];
};

export type RenderViewRef = {
  start: () => void;
  stop: () => void;
};

export const RenderView = forwardRef((props: Props, ref: Ref<RenderViewRef>) => {
  const update = props.funcs.find(func => func.name === "update");
  const renderViewElement = useRef<HTMLDivElement>(null);
  const app = useRef<PIXI.Application>();

  useEffect(() => {
    app.current = new PIXI.Application({antialias: true});
    renderViewElement.current!.appendChild(app.current.view);
    app.current.stop();

    const rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xde3249);
    rectangle.drawRect(50, 50, 100, 100);
    rectangle.endFill();
    app.current.stage.addChild(rectangle);

    if (update) {
      const move = (x: number, y: number) => {
        rectangle.x += x;
        rectangle.y += y;
      };

      app.current.ticker.add(async () => {
        await interpret(update.body, props.funcs, {move});
      });
    }

    return () => {
      app.current!.destroy(true);
    };
  }, [update]);

  useImperativeHandle(ref, () => ({
    start: () => {
      app.current!.start();
    },
    stop: () => {
      app.current!.stop();
    }
  }));

  return <div className="RenderView" ref={renderViewElement} />;
});
