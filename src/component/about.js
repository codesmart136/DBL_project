import React from 'react';
import { useEffect, useState } from "react";
import Slider from "react-slick";

function About() {
    const [timers, setTimers] = useState({autoPlay: null});
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      };
    const [settingsGO, setSettingsGO] = useState({
        arrows: false,
        dots: false,
        infinite: true,
        slidesToShow: 7,
        slidesToScroll: 1,
        cssEase: "linear",
        autoplay: true,
        speed: 500,
        autoplaySpeed: 0,
    });
    const [settingsGT, setSettingsGT] = useState({
        arrows: false,
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        cssEase: "linear",
        rtl: true,
        autoplay: true,
        speed: 4000,
        autoplaySpeed: 0,
    });

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      window.removeEventListener("resize", onResize);
    }
  }, []);

  const onResize = () => {
    let width = document.body.clientWidth;
    if (width < 380) {
      setSettingsGT({
        ...settingsGT,
        slidesToShow: 1,
        speed: 6000
      });
      setSettingsGO({
        ...settingsGO,
        slidesToShow: 1,
        speed: 6000
      });
    } else if (width < 700) {
      setSettingsGT({
        ...settingsGT,
        slidesToShow: 3,
        speed: 4000
      });
      setSettingsGO({
        ...settingsGO,
        slidesToShow: 3,
        speed: 4000
      });
    } else {
      setSettingsGT({
        ...settingsGT,
        slidesToShow: 7,
        speed: 4000
      });
      setSettingsGO({
        ...settingsGO,
        slidesToShow: 7,
        speed: 4000
      });
    }
  }
    return (
        <section id="about" className="about">
            <div className="about-animation">
                <div className="MS-content" style={{paddingTop:"10px"}}>
                    <Slider {...settingsGO}>
                        <div className="item"><img src="/images/ape2.png" alt="" /></div>
                        <div className="item"><img src="/images/ape2.png" alt="" /></div>
                        <div className="item"><img src="/images/ape2.png" alt="" /></div>
                        <div className="item"><img src="/images/ape2.png" alt="" /></div>
                        <div className="item"><img src="/images/ape2.png" alt="" /></div>
                        <div className="item"><img src="/images/ape2.png" alt="" /></div>
                        <div className="item"><img src="/images/ape2.png" alt="" /></div>
                        <div className="item"><img src="/images/ape2.png" alt="" /></div>
                    </Slider>
                </div>
                <div className="MS-content" style={{paddingTop:"10px"}}>
                    <Slider {...settingsGT}>
                        <div className="item"><img src="/images/ape2.png" alt="" /></div>
                        <div className="item"><img src="/images/ape2.png" alt="" /></div>
                        <div className="item"><img src="/images/ape2.png" alt="" /></div>
                        <div className="item"><img src="/images/ape2.png" alt="" /></div>
                        <div className="item"><img src="/images/ape2.png" alt="" /></div>
                        <div className="item"><img src="/images/ape2.png" alt="" /></div>
                        <div className="item"><img src="/images/ape2.png" alt="" /></div>
                        <div className="item"><img src="/images/ape2.png" alt="" /></div>
                    </Slider>
                </div>
                
            </div>
            <br /><br />
        </section>
    )
}

export default About