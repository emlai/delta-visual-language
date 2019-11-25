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
  const rectangle = useRef<PIXI.Graphics>();

  const move = (x: number, y: number) => {
    rectangle.current!.x += x;
    rectangle.current!.y += y;
  };

  useEffect(() => {
    app.current = new PIXI.Application({antialias: true, autoStart: false});
    renderViewElement.current!.appendChild(app.current.view);

    rectangle.current = new PIXI.Graphics()
      .beginFill(0xde3249)
      .drawRect(50, 50, 100, 100)
      .endFill();
    app.current.stage.addChild(rectangle.current);

    return () => {
      app.current!.destroy(true);
    };
  }, []);

  useEffect(() => {
    if (!update) return;
    const listener = () => interpret(update.body, props.funcs, {move});
    app.current!.ticker.add(listener);

    return () => {
      app.current!.ticker.remove(listener);
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
