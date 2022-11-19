import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { Input, Button, useNotification, ConnectButton } from "web3uikit";
import { abi, contractAddresses } from "../constants";
import { ethers } from "ethers";
export default function Game() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState("");
  const [getIntervalValue, setGetIntervalValue] = useState("");
  const [raffletState, setRaffleSTate] = useState("");
  const [numberOfPlayers, setNumberOfPlayers] = useState("");
  const [recentWinner, setRecentWinner] = useState("");

  const {
    runContractFunction: enterRaffle,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });
  const { runContractFunction: getInterval } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getInterval",
    params: {},
  });
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });
  const { runContractFunction: getRaffleState } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getPlayer",
    params: {},
  });
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });
  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  async function updateUI() {
    const entranceFeeFromCall = (await getEntranceFee()).toString()
      ? 100000000000000000
      : 100000000000000000;
    const getIntervalFromCall = (await getInterval()).toString();
    const getRaffleStateFromCall = await getRaffleState();
    const numberOfPlayersFromCall = (await getNumberOfPlayers()).toString();
    const recentWinnerFromCall = await getRecentWinner();
    setEntranceFee(entranceFeeFromCall);
    setNumberOfPlayers(numberOfPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
    setRaffleSTate(getRaffleStateFromCall);
    setGetIntervalValue(getIntervalFromCall);
  }
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  // async function latestTweets() {
  //   const id = await getLatestTweets();
  //   console.log(id);
  //   document.getElementById("latestTweets").innerHTML = id;
  // }

  const dispatch = useNotification();

  const handleError = async (error, id) => {
    const e = error;
    document.getElementById(id).innerHTML =
      error == "[object Object]" ? " : error! please check console" : error;
    console.log(id);
  };
  const handleSuccess = async (tx) => {
    try {
      await tx.wait(1);
      handleNewNotification(tx);
      console.log("successfull");
      // updateUI();
    } catch (error) {
      console.log(error);
    }
  };
  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "transaction complete!",
      title: "transaction notification",
      position: "topR",
      icon: "bell",
    });
    document.getElementById("enterRaffle").innerHTML = "";
  };

  return (
    <div class="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 ...">
      <div>
        <p className=" flex justify-center pb-4 font-bold">
          {isWeb3Enabled ? (
            <p className="ml-0">🙂</p>
          ) : (
            "Please connect to a supported chain (goerli) to interact!"
          )}
        </p>
      </div>
      <div className="flex w-screen h-32">
        <div className="h-32 w-1/3 ">
          <span className="flex justify-center">
            Interval Status is(unix) : {getIntervalValue}
          </span>
        </div>
        <div className="h-32 w-1/3 ">
          <span>
            Current Lottery entry Fee is :
            {ethers.utils.formatEther("100000000000000000", "ether")} ETH!
          </span>
          <span id="enterRaffle"></span>
        </div>
        <div className="h-32 w-1/3 ">
          <span>
            Current state of the lottery: {raffletState ? raffletState : "OPEN"}
          </span>
        </div>
      </div>
      <div className="w-screen flex justify-center h-40">
        <div className="flex justify-center box-border p-2 bg-blue-500 shadow-xl shadow-red-500 rounded-xl ring-2 border-blue-600  ...">
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
              onClick={async function () {
                await enterRaffle({
                  onSuccess: handleSuccess,
                  onError: (error) => console.log(error, "enterRaffle"),
                });
              }}
              disabled={isLoading || isFetching}
            >
              {isLoading || isFetching ? (
                <div className="animate-spin spinner-border h-20 w-20 border-b-2 rounded-full"></div>
              ) : (
                <div>Enter Raffle</div>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-screen h-32">
        <div className="h-32 w-1/2 ">
          <span>
            The Previous winner was:{" "}
            {recentWinner == "0x0000000000000000000000000000000000000000"
              ? "The first lottery has not ended yet! "
              : recentWinner}
          </span>
        </div>
        <div className="h-32 w-1/2 ">
          <span>
            The number of the players joined in the Lottery: {numberOfPlayers}
          </span>
        </div>
      </div>
    </div>
  );
}
