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

export type Callbacks = {
  update: Func | undefined;
  onKeys: Func[];
};

export const RenderView = forwardRef((props: Props, ref: Ref<RenderViewRef>) => {
  const renderViewElement = useRef<HTMLDivElement>(null);
  const app = useRef<PIXI.Application>();
  const callbacks = useRef<Callbacks>();

  callbacks.current = {
    update: props.funcs.find(func => func.name === "update"),
    onKeys: props.funcs.filter(func => func.name.startsWith("onKey"))
  };

  useEffect(() => {
    app.current = new PIXI.Application({antialias: true, autoStart: false});
    renderViewElement.current!.appendChild(app.current.view);

    const keys = new Set();
    onkeydown = event => keys.add(event.code);
    onkeyup = event => keys.delete(event.code);

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
      const {update, onKeys} = callbacks.current!;

      if (update) {
        interpret(update.body, props.funcs, nativeFuncs);
      }

      for (const onKey of onKeys) {
        const code = onKey.name.split(" ")[1];
        if (keys.has(code)) {
          interpret(onKey.body, props.funcs, nativeFuncs);
        }
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
