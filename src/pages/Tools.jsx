import React from "react";
import Header from "../components/Header";
import ButtonGradient from "../assets/svg/ButtonGradient";
import Heading from "../components/Heading";
import { tools } from "../constants";
import Arrow from "../assets/svg/Arrow";
import { GradientLight } from "../components/design/Benefits";
import ClipPath from "../assets/svg/ClipPath";
import Button from "../components/Button";
import { BackgroundCircles, Gradient } from "../components/design/Hero";
import { Rings } from "../components/design/Header";

const Tools = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.35rem] overflow-hidden">
        <Header />

        <div className="container relative z-2 mt-10">
          <Heading
            className="md:max-w-md lg:max-w-2xl"
            title="AI Content Generator for Educational Tasks"
          />

          <div className="flex flex-wrap justify-center gap-10 mb-10">
            {tools.map((item) => (
              <div
                className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
                style={{
                  backgroundImage: `url(${item.backgroundUrl})`,
                }}
                key={item.id}
              >
                <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem]">
                  <h5 className="h5 mb-5 text-center font-bold text-blue-500">
                    {item.title}
                  </h5>
                  <p className="body-2 mb-6 text-n-3 text-center">
                    {item.text}
                  </p>
                  <div className="flex items-center mt-auto">
                    <img
                      src={item.iconUrl}
                      width={48}
                      height={48}
                      alt={item.title}
                    />
                    <Button className={"ml-auto"} href={item.url}>
                      Let's Start
                    </Button>

                    <Arrow />
                  </div>
                </div>

                {item.light && <GradientLight />}

                <div
                  className="absolute inset-0.5 bg-n-8"
                  style={{ clipPath: "url(#benefits)" }}
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-20">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        width={380}
                        height={362}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                <ClipPath />
              </div>
            ))}
          </div>
        </div>
        <h5 className="tagline mt-10 mb-10 text-center text-n-1/50">
          More tools Comming soon...
        </h5>
      </div>
      <Rings />
      <BackgroundCircles />

      <ButtonGradient />
    </>
  );
};

export default Tools;
