import React, { useEffect, useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { timerOptions } from "./utils/contants";
import { sendNotification } from "@tauri-apps/api/notification";
import { ask } from "@tauri-apps/api/dialog";

const App = () => {
  const [time, setTime] = useState(0);
  const [timerStart, setTimerStart] = useState(false);

  const toggleTimer = () => {
    setTimerStart(!timerStart);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerStart) {
        if (time > 0) {
          setTime(time - 1);
        } else if (time === 0) {
          sendNotification({
            title: `Time's up!`,
            body: `Congrats on completing a session!🎉`,
          });
          clearInterval(interval);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timerStart, time]);

  const triggerResetDialog = async () => {
    let shouldReset = await ask("Do you want to reset timer?", {
      title: "Pomodoro Timer App",
      type: "warning",
    });
    if (shouldReset) {
      setTime(900);
      setTimerStart(false);
    }
  };

  return (
    <div className="App" style={{ height: "100%" }}>
      <Flex
        background="gray.700"
        height="100%"
        alignItems="center"
        flexDirection="column"
      >
        <Text color="white" fontWeight="bold" marginTop="20" fontSize="35">
          Pomodoro Timer
        </Text>
        <Text fontWeight="bold" fontSize="150px" color="white">
          {`${
            Math.floor(time / 60) < 10
              ? `0${Math.floor(time / 60)}`
              : `${Math.floor(time / 60)}`
          }:${time % 60 < 10 ? `0${time % 60}` : time % 60}`}
        </Text>
        <Flex>
          <Button
            width="7rem"
            style={{ backgroundColor: "#ff5b5b" }}
            color="white"
            onClick={toggleTimer}
          >
            {!timerStart ? "Start" : "Pause"}
          </Button>
          <Button
            style={{ backgroundColor: "#7070ff" }}
            marginX={5}
            onClick={triggerResetDialog}
          >
            Reset
          </Button>
        </Flex>
        <Text fontWeight="bold" fontSize="50x" color="white" marginTop={30}>
          Timer Options:
        </Text>
        <Flex>
          {timerOptions.map(({ value, display }) => (
            <Button
              key={value}
              marginX={4}
              style={{ backgroundColor: "#72b172" }}
              color="white"
              onClick={() => {
                setTimerStart(false);
                setTime(value);
              }}
            >
              {display}
            </Button>
          ))}
        </Flex>
      </Flex>
    </div>
  );
};
export default App;
