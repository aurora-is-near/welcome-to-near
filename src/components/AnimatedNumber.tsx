import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

const AnimatedNumber = ({
  value,
  fractionDigits = 2,
}: {
  value: number;
  fractionDigits?: number;
}) => {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: fractionDigits,
    }).format(current)
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
};

export default AnimatedNumber;
