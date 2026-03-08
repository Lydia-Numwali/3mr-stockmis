import React from 'react';
import dayjs from 'dayjs';

interface GreetingProps {
  name: string;
}

const Greeting: React.FC<GreetingProps> = ({ name }) => {
  const hour = dayjs().hour();

  let greeting = 'Hello';
  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  return (
    <h4 className="font-medium text-[24px]">
      {greeting}, {name}!
    </h4>
  );
};

export default Greeting;
