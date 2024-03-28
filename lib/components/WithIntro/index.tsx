// import React, { ComponentType, useEffect, useState } from "react";
import { ComponentType, useEffect, useState } from "react";
import styles from "./styles.module.css";

interface WithIntroProps {
  backgroundImage: string;
  duration: number; // in milliseconds
}

// Higher Order Component (~ wrapper) to add an intro to a component
export function WithIntro<T extends object>(
  WrappedComponent: ComponentType<T>,
  introProps: WithIntroProps
) {
  return (props: T) => {
    const [showIntro, setShowIntro] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, introProps.duration);

      return () => clearTimeout(timer);
    }, [introProps.duration]);

    return (
      <>
        {showIntro && (
          <div
            style={{ backgroundImage: `url(${introProps.backgroundImage})` }}
            className={styles.withintro}
          >
            {/* Additional content here, such as a loading spinner */}
          </div>
        )}
        <WrappedComponent {...props} />
      </>
    );
  };
}
