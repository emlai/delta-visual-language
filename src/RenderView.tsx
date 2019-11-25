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
  const update = useRef<Func>();
  update.current = props.funcs.find(func => func.name === "update");
  const renderViewElement = useRef<HTMLDivElement>(null);
  const app = useRef<PIXI.Application>();

  useEffect(() => {
    app.current = new PIXI.Application({antialias: true, autoStart: false});
    renderViewElement.current!.appendChild(app.current.view);

    const rectangle = new PIXI.Graphics()
      .beginFill(0xde3249)
      .drawRect(0, 0, 100, 100)
      .endFill();
    rectangle.pivot.set(50, 50);
    app.current.stage.addChild(rectangle);

    const nativeFuncs = {
      move: (x: number, y: number) => {
        rectangle.x += x;
        rectangle.y += y;
      },
      rotate: (radians: number) => {
        rectangle.rotation += radians;
      }
    };

    app.current!.ticker.add(async () => {
      if (update.current) {
        await interpret(update.current.body, props.funcs, nativeFuncs);
      }
    });

    return () => {
      app.current!.destroy(true);
    };
  }, []);

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
