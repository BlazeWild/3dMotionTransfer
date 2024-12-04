import { useLocation } from 'react-router-dom';
import {CanvasComponent} from './canvas';
import {styles} from '../styles';
import {FBXWithAnimation} from './canvas';
import React from 'react';


const Homepage = () => {
  return (
<section
  className="relative w-full h-screen mx-auto
  bg-kingdom bg-contain bg-cover bg-no-repeat bg-center"
>
      <div
           className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-col items-center gap-5`}
       >
        {/* Ensures the CanvasComponent takes full screen dimensions */}
        <CanvasComponent />
      </div>
    </section>
  );
};

export default Homepage;
