import * as React from "react";
import {forwardRef, Ref, useEffect, useImperativeHandle} from "react";
import * as PIXI from "pixi.js";
import {Func, interpret} from "./interpreter";

type Props = {
  funcs: Func[];
};

export type RenderViewRef = {
  start: () => void;
};

export const RenderView = forwardRef((props: Props, ref: Ref<RenderViewRef>) => {
  const update = props.funcs.find(func => func.name === "update");
  let app: PIXI.Application;

  useEffect(() => {
    app = new PIXI.Application({antialias: true});
    document.getElementsByClassName("RenderView")[0].appendChild(app.view);
    app.stop();

    const rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xde3249);
    rectangle.drawRect(50, 50, 100, 100);
    rectangle.endFill();
    app.stage.addChild(rectangle);

    if (update) {
      const move = () => {
        rectangle.x += 1;
      };

      app.ticker.add(async () => {
        await interpret(update.body, props.funcs, {move});
      });
    }

    return () => {
      app.destroy(true);
    };
  }, [update]);

  useImperativeHandle(ref, () => ({
    start: () => {
      app.start();
    }
  }));

  return <div className="RenderView" />;
});
