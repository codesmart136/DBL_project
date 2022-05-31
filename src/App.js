import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";


import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  width: 188px;
  height: 60px;
  color: white;
  background: #2c2f1e;
  cursor: pointer;
  font-size: 26px;
  font-family: initial;
  :hover {
    background-color: #393d27 !important;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: #2c2f1e;
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: white;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  :focus {
    outline: none;
  }
  :hover {
    background-color: #393d27 !important;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 4,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1000,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 2) {
      newMintAmount = 2;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <div id="root" class="app">
          <nav id="nav" class="navbar navbar-expand-md navbar-light sticky-top">
              <a href="" id="bayc-brand" class="navbar-brand">
                  <img src="images/bayc-logo-z.png" class="d-inline-block align-top" alt="bored ape logo" height="75px" width="auto"/>
              </a>
              <button aria-controls="responsive-navbar-nav" id="nav-toggle" type="button" aria-label="Toggle navigation" class="navbar-dark navbar-toggler collapsed">
                  <span class="navbar-toggler-icon"></span>
              </button>
              <div class="navbar-collapse collapse">
                  <div class="navbar-nav" id="nav-bar">
                      <a id="nav-link" title="WELCOME" href="#nav" data-rb-event-key="/gallery" class="nav-link">WELCOME</a>
                      <a id="nav-link" title="BUY A Specimen" href="#buy_an" class="nav-link">BUY A SPECIMEN</a>
                      <a  id="nav-link" title="ROADMAP" href="#roadmap" class="nav-link">ROADMAP</a>
                      <a id="nav-link" title="TEAM" href="#team" class="nav-link">TEAM</a>
                  </div>
                  <div class="navbar-nav" id="nav-social">
                      <a href=""><i class="fa fa-youtube-play social-icon pr-lg-0"></i></a>
                      <a href="https://www.instagram.com/differentbreedlabs/"><i class="fa fa-instagram social-icon pr-lg-0"></i></a>
                      <a href="https://discord.gg/uqnphDGK"><i class="fa fa-discord-alt social-icon pr-lg-0"></i></a>
                      <a href="https://mobile.twitter.com/breed_labs"><i class="fa fa-twitter social-icon pr-lg-0"></i></a>
                  </div>
              </div>           
          </nav>

          <div>
              <div>
                  <div class="common-container">
                    <div class="mb-4 mb-lg-5 container">
                        <div class="row">
                            <div class="px-0 col-12">
                                {/* <!-- <img src="./BAYC_files/bayc-mutant-hero.jpg" class="img-fluid px-0" usemap="#mutant"> --> */}
                            </div>
                        </div>
                    </div>
                      
                      <div class="px-4 mt-md-4 container">
                          <div class="mb-5 row" id="welcome">
                              <div class="col">
                                  <div class="mb-4 row">
                                      <div class="mb-4 col-lg-7 col-12">
                                          <h1 class="d-flex font-italic welcome-title mb-3">WELCOME TO<br/>DIFFERENT BREED LABS</h1>
                                          <p class="common-p mb-0 font-weight-bold mb-1">THE ORIGIN OF DIFFERENT BREED LABS?</p>
                                          <p class="common-p mb-0">DBL (for short) is a laboratory where a group of deranged scientists have finally completed the first steps of their long awaited creation, The Specimens. There are rumored to be 10,000 of these specimens on the Polygon blockchain with all of their traits being handmade. The scientists created these specimens in hopes to create the most evolved species on the planet but still haven't mastered the chemical compounds to push them to the next stage of their evolution. Which means there is more to come from these Deranged scientists!</p>
                                      </div>
                                      <div class="my-lg-auto col-lg-4 col-12 offset-lg-1">
                                          <div class="common-container">
                                              <div class="row">
                                                  <div class="pb-2 pr-2 col-6"><img class="img-fluid welcome-image"
                                                          src="images/ape1.png" alt="ape1" aria-label="ape1"/>
                                                  </div>
                                                  <div class="pb-2 pl-2 col-6"><img class="img-fluid welcome-image"
                                                          src="images/ape2.png" alt="ape2" aria-label="ape2"/>
                                                  </div>
                                              </div>
                                              <div class="row">
                                                  <div class="pt-2 pr-2 col-6"><img class="img-fluid welcome-image"
                                                          src="images/ape3.png" alt="ape3" aria-label="ape3"/>
                                                  </div>
                                                  <div class="pt-2 pl-2 col-6"><img class="img-fluid welcome-image"
                                                          src="images/ape4.png" aria-label="ape4"/></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div class="row"  id="buy_an">
                                      <div class="mb-3 col-12">
                                          <h3 class="fair-title">DISTRIBUTION</h3>
                                      </div>
                                      <div class="mb-2 mb-lg-0 col-lg-7 col-12">
                                          <p class="common-p mb-lg-0">Buying a specimen will cost the same for everyone. Each Specimen will cost 300 Matic.</p>
                                      </div>
                                      <div class="col-lg-4 col-12 offset-lg-1">
                                          <p class="note text-justify mb-0">Note: Thirty specimens will be withheld from the sale. These specimens will be used for giveaways, holders and the creators membership access.</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="mb-5 row">
                              <div class="col">
                                  <div id="buy-an-ape" class="buy-token-container">
                                      <div class="bayc-bg p-4 m-auto row">
                                          <div class="m-auto col-lg-3 col-12">
                                              <h3 class="buy-ape-title">BUY A SPECIMEN</h3>
                                          </div>
                                          <div class="m-auto col-lg-4 col-12 offset-lg-1">
                                              {/* <!-- <p class="common-p mb-lg-0">The initial sale has sold out. To get your
                                                  Bored Ape, check out the collection on OpenSea.</p> --> */}
                                          </div>
                                          <div class="m-auto col-lg-3 col-12 offset-lg-1">
                                              <s.Container
                                                flex={2}
                                                jc={"center"}
                                                ai={"center"}
                                              >
                                                {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                                                <>
                                                    <s.TextTitle
                                                        style={{ textAlign: "center", color: "var(--accent-text)" }}
                                                    >
                                                        The sale has ended.
                                                    </s.TextTitle>
                                                    <s.TextDescription
                                                        style={{ textAlign: "center", color: "var(--accent-text)" }}
                                                    >
                                                    You can still find {CONFIG.NFT_NAME} on
                                                    </s.TextDescription>
                                                    <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                                                        {CONFIG.MARKETPLACE}
                                                    </StyledLink>
                                                </>
                                                ) : (
                                                <>
                                                    {blockchain.account === "" ||
                                                    blockchain.smartContract === null 
                                                    ? (
                                                    <s.Container ai={"center"} jc={"center"}>
                                                        <button
                                                          className="bayc-button mint"
                                                          onClick={(e) => {
                                                              e.preventDefault();
                                                              dispatch(connect());
                                                              getData();
                                                          }}
                                                        >
                                                        BUY A SPECIMEN HERE
                                                        </button>
                                                    </s.Container>
                                                    ) 
                                                    : (
                                                    <>
                                                        <button
                                                          className="bayc-button mint"
                                                          disabled={claimingNft ? 1 : 0}
                                                          onClick={(e) => {
                                                            e.preventDefault();
                                                            claimNFTs();
                                                            getData();
                                                          }}
                                                        >
                                                          {claimingNft ? "BUSY" : "MINT A SPECIMEN"}
                                                        </button>
                                                    </>
                                                    )}
                                                </>
                                                )}
                                              </s.Container>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <hr class="gray-line mb-5"/>
                          <div class="mb-5 row">
                              <div class="col">
                                  <div class="common-container">
                                      <div class="row">
                                          <div class="mb-3 col-lg-7 col-12">
                                              <h2 class="common-title mb-3">About</h2>
                                              <p class="common-p">Each Specimen is generated from over 130 handmade traits which include clothing, headwear, necklaces,skins and more. All of these Specimens are rare but some are rarer than others.
                                                  <hr/>The specimens live on the blockchain as ERC-721 tokens and are located on IPFS.
                                                  <hr/>Purchasing a specimen will cost 300 Matic
                                              </p>
                                          </div>
                                          <div class="my-auto col-lg-4 col-12 offset-lg-1"><img class="img-fluid w-100 gif"
                                                  src="images/gif.gif" alt="mystery token"/></div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <hr class="gray-line mb-5" />
                          <div class="mb-2 row" id="roadmap">
                              <div class="col">
                                  <div id="roadmap" class="common-container">
                                      <div class="row">
                                          <div class="mb-3 col-lg-9 col-12">
                                              <h2 class="common-title mb-3">The Road Ahead</h2>
                                              <p class="common-p">"Impossible" is not a scientific term.</p>
                                              <p class="common-p">The scientists at Different Breed Labs don’t believe in impossible and will continue to strive to make the ultimate Specimens but there are a lot of steps to achieve such greatness. Those steps lie below.</p>
                                          </div>
                                          <div class="ag-timeline-block common-container">
                                              <section class="ag-section">
                                              <div class="ag-format-container" style={{"width": "100%"}}>
                                                  <div class="js-timeline ag-timeline">
                                                  <div class="js-timeline_line ag-timeline_line">
                                                      <div class="js-timeline_line-progress ag-timeline_line-progress"></div>
                                                  </div>
                                                  <div class="ag-timeline_list">
                                                      <div class="js-timeline_item ag-timeline_item">
                                                      <div class="ag-timeline-card_box">
                                                          <div class="js-timeline-card_point-box ag-timeline-card_point-box">
                                                          <div class="ag-timeline-card_point">1</div>
                                                          </div>
                                                          <div class="ag-timeline-card_meta-box">
                                                          <div class="ag-timeline-card_meta">Step 1</div>
                                                          </div>
                                                      </div>
                                                      <div class="ag-timeline-card_item">
                                                          <div class="ag-timeline-card_inner">
                                                          <div class="ag-timeline-card_info">
                                                              <div class="ag-timeline-card_title">Step 1</div>
                                                              <div class="ag-timeline-card_desc">
                                                                  15 Specimens will be withheld from the sale and distributed randomly to 15 holders when the
                                                                  public sale ends.
                                                              </div>
                                                          </div>
                                                          </div>
                                                          <div class="ag-timeline-card_arrow"></div>
                                                      </div>
                                                      </div>
                                          
                                                      <div class="js-timeline_item ag-timeline_item">
                                                      <div class="ag-timeline-card_box">
                                                          <div class="ag-timeline-card_meta-box">
                                                          <div class="ag-timeline-card_meta">Step 2</div>
                                                          </div>
                                                          <div class="js-timeline-card_point-box ag-timeline-card_point-box">
                                                          <div class="ag-timeline-card_point">2</div>
                                                          </div>
                                                      </div>
                                                      <div class="ag-timeline-card_item">
                                                          <div class="ag-timeline-card_inner">
                                                          <div class="ag-timeline-card_info">
                                                              <div class="ag-timeline-card_title">Step 2</div>
                                                              <div class="ag-timeline-card_desc">
                                                                  Assemble a team to further the vision of Different Breed Labs. As of now only 2 scientists have
                                                                  worked on the project and bringing in 1-2 more scientists could provide some helpful insight and
                                                                  bring new concepts to add value.                                                                        
                                                              </div>
                                                          </div>
                                                          </div>
                                                          <div class="ag-timeline-card_arrow"></div>
                                                      </div>
                                                      </div>
                                          
                                                      <div class="js-timeline_item ag-timeline_item">
                                                      <div class="ag-timeline-card_box">
                                                          <div class="js-timeline-card_point-box ag-timeline-card_point-box">
                                                          <div class="ag-timeline-card_point">3</div>
                                                          </div>
                                                          <div class="ag-timeline-card_meta-box">
                                                          <div class="ag-timeline-card_meta">Step 3</div>
                                                          </div>
                                                      </div>
                                                      <div class="ag-timeline-card_item">
                                                          <div class="ag-timeline-card_inner">
                                                          <div class="ag-timeline-card_info">
                                                              <div class="ag-timeline-card_title">Step 3</div>
                                                              <div class="ag-timeline-card_desc">
                                                                  In the holder-only discord server, members will be able to vote on which charities they would like
                                                                  to give back to. Keep in mind the majority vote always rules.                                                                        
                                                              </div>
                                                          </div>
                                                          </div>
                                                          <div class="ag-timeline-card_arrow"></div>
                                                      </div>
                                                      </div>
                                          
                                                      <div class="js-timeline_item ag-timeline_item">
                                                      <div class="ag-timeline-card_box">
                                                          <div class="ag-timeline-card_meta-box">
                                                          <div class="ag-timeline-card_meta">Step 4</div>
                                                          </div>
                                                          <div class="js-timeline-card_point-box ag-timeline-card_point-box">
                                                          <div class="ag-timeline-card_point">4</div>
                                                          </div>
                                                      </div>
                                                      <div class="ag-timeline-card_item">
                                                          <div class="ag-timeline-card_inner">
                                                          <div class="ag-timeline-card_info">
                                                              <div class="ag-timeline-card_title">Step 4</div>
                                                              <div class="ag-timeline-card_desc">
                                                                  The first DBL merchandise (hats, keychains, shirts, hoodies, etc.) will be exclusively for holders
                                                                  only for a 48 hour period. If merchandise still remains after the 48 hour period it will be released
                                                                  to the public.
                                                              </div>
                                                          </div>
                                                          </div>
                                                          <div class="ag-timeline-card_arrow"></div>
                                                      </div>
                                                      </div>
                                          
                                                      <div class="js-timeline_item ag-timeline_item">
                                                      <div class="ag-timeline-card_box">
                                                          <div class="js-timeline-card_point-box ag-timeline-card_point-box">
                                                          <div class="ag-timeline-card_point">5</div>
                                                          </div>
                                                          <div class="ag-timeline-card_meta-box">
                                                          <div class="ag-timeline-card_meta">Step 5</div>
                                                          </div>
                                                      </div>
                                                      <div class="ag-timeline-card_item">
                                                          <div class="ag-timeline-card_inner">
                                                          <div class="ag-timeline-card_info">
                                                              <div class="ag-timeline-card_title">Step 5</div>
                                                              <div class="ag-timeline-card_desc">
                                                                  The Loser Labs drop will also be exclusively for holders who own a specimen. Holders will be
                                                                  airdropped Losers from the collection for no cost at all (besides gas), holders will have 1 week
                                                                  to claim their Loser if not it will be incinerated.
                                                              </div>
                                                          </div>
                                                          </div>
                                                          <div class="ag-timeline-card_arrow"></div>
                                                      </div>
                                                      </div>
                                          
                                                      <div class="js-timeline_item ag-timeline_item">
                                                      <div class="ag-timeline-card_box">
                                                          <div class="ag-timeline-card_meta-box">
                                                          <div class="ag-timeline-card_meta">Step 6</div>
                                                          </div>
                                                          <div class="js-timeline-card_point-box ag-timeline-card_point-box">
                                                          <div class="ag-timeline-card_point">6</div>
                                                          </div>
                                                      </div>
                                                      <div class="ag-timeline-card_item">
                                                          <div class="ag-timeline-card_inner">
                                                          <div class="ag-timeline-card_info">
                                                              <div class="ag-timeline-card_title">Step 6</div>
                                                              <div class="ag-timeline-card_desc">
                                                                  Holders of Specimens and Losers will be granted access to “The Lab” once it is completed.
                                                                  There holders will be able to add one chemical compound to the mix which will be used during
                                                                  “The Outbreak”. Holders will also get updates and sneak peeks in “The Lab” to upcoming events
                                                                  and projects.                                                                        
                                                              </div>
                                                          </div>
                                                          </div>
                                                          <div class="ag-timeline-card_arrow"></div>
                                                      </div>
                                                      </div>
                                          
                                                      <div class="js-timeline_item ag-timeline_item">
                                                      <div class="ag-timeline-card_box">
                                                          <div class="js-timeline-card_point-box ag-timeline-card_point-box">
                                                          <div class="ag-timeline-card_point">7</div>
                                                          </div>
                                                          <div class="ag-timeline-card_meta-box">
                                                          <div class="ag-timeline-card_meta">Step 7</div>
                                                          </div>
                                                      </div>
                                                      <div class="ag-timeline-card_item">
                                                          <div class="ag-timeline-card_inner">
                                                          <div class="ag-timeline-card_info">
                                                              <div class="ag-timeline-card_title">Step 7</div>
                                                              <div class="ag-timeline-card_desc">
                                                                  3D Specimens will be airdropped to current Specimen holders to use within the metaverse. 3D
                                                                  Specimens may come before or after “The Outbreak” ; it is still TBD.                                                                        
                                                              </div>
                                                          </div>
                                                          </div>
                                                          <div class="ag-timeline-card_arrow"></div>
                                                      </div>
                                                      </div>
                                          
                                                      <div class="js-timeline_item ag-timeline_item">
                                                      <div class="ag-timeline-card_box">
                                                          <div class="ag-timeline-card_meta-box">
                                                          <div class="ag-timeline-card_meta">Step 8</div>
                                                          </div>
                                                          <div class="js-timeline-card_point-box ag-timeline-card_point-box">
                                                          <div class="ag-timeline-card_point">8</div>
                                                          </div>
                                                      </div>
                                                      <div class="ag-timeline-card_item">
                                                          <div class="ag-timeline-card_inner">
                                                          <div class="ag-timeline-card_info">
                                                              <div class="ag-timeline-card_title">Step 8</div>
                                                              <div class="ag-timeline-card_desc">
                                                                  “The Outbreak” is the next step in the Specimens evolution or it could be the first step into a
                                                                  catastrophic event…. Change is needed to evolve but the question is, did we get the formula
                                                                  right ?
                                                              </div>
                                                          </div>
                                                          </div>
                                                          <div class="ag-timeline-card_arrow"></div>
                                                      </div>
                                                      </div>
                                                  </div>
                                                  </div>
                                              </div>
                                              </section>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <hr class="gray-line mb-5" />
                          <div class="row" id="team">
                              <div class="col">
                                  <div id="team" class="common-container">
                                      <div class="mb-3 col-lg-8 col-12">
                                          <h2 class="common-title mb-3">The Scientists</h2>
                                      </div>
                                      <div class="container-team">
                                          <div class="at-section">
                                          </div>
                                          <div data-column='2' class="at-grid">
                                              <div class="at-column">
                                                  <div class="at-user">
                                                      <div class="at-user__avatar"><img src="images/ceo.png" /></div>
                                                      <div class="at-user__name">The Mad Scientist</div>
                                                      <div class="at-user__title">Head Scientist</div>
                                                      <div class="at-user__des">The Mad Scientist is the creator of the Specimens. He assembled and created every body part that the specimens have from scratch.</div>
                                                      <ul class="at-social">
                                                          <li class="at-social__item"><a href="#">
                                                            <img src="https://mediadome.de/storage/Icons/instagram_black.svg" /></a></li>
                                                          <li class="at-social__item"><a href="#">
                                                            <img src="https://mediadome.de/storage/Icons/linkedin_black.svg" /></a></li>
                                                      </ul>
                                                  </div>
                                              </div>
                                              <div class="at-column">
                                                  <div class="at-user">
                                                      <div class="at-user__avatar"><img src="images/cto.png" /></div>
                                                      <div class="at-user__name">The Handsome Scientist</div>
                                                      <div class="at-user__title">The Brainiac</div>
                                                      <div class="at-user__des">There were 2 brains to the operation but “The Brainiac’s” was just a bit bigger. He helped assemble the Specimen’s body parts, wrote the code to give them life and programmed them all from scratch.</div>
                                                      <ul class="at-social">
                                                          <li class="at-social__item"><a href="#">
                                                            <img src="https://mediadome.de/storage/Icons/instagram_black.svg"/></a></li>
                                                          <li class="at-social__item"><a href="#">
                                                            <img src="https://mediadome.de/storage/Icons/linkedin_black.svg"/></a></li>
                                                      </ul>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="mb-5 row">
                              <div class="col">
                                  <div class="d-flex justify-content-center">
                                      <p class="common-p text-center text-break mb-0">
                                          <span class="bold-text">VERIFIED SMART CONTRACT ADDRESS: </span>
                                          <a 
                                              title="0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
                                              href="#"
                                              class="link">
                                              0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f12D
                                          </a>
                                      </p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <footer class="footer">
              <div class="container-fluid footer-line">
                  <hr class="p-0 line"/>
                  <div class="row mx-0 footer-padding">
                      <div class="col-12 col-lg-4 order-lg-first my-lg-auto">
                          <div class="email-container"><span class="email-label">GET ON THE LIST</span><br/>
                              <div class="d-flex email-flex"><br/>
                                  <form id="email-submit" method="post" name="mc-embedded-subscribe-form" target="_blank"
                                      class="email-form"><input id="email-address" class="m-0 email-input-text"
                                          type="email" placeholder="Email Address" name="EMAIL" required="" value=""/>
                                      <div aria-hidden="true" style={{"position": "absolute", "left": "-5000px"}}><input
                                              type="text" name="b_c979ffabc41007fd79ffe121b_b785550a9e" tabindex="-1"
                                              value=""/></div><button name="subscribe" class="email-submit"
                                          type="submit">→</button>
                                  </form>
                              </div>
                          </div>
                      </div>
                      <div class="col-12 col-lg-4 order-first"><img class="img-fluid footer-logo"
                              src="images/DBL-footer.png" alt="logo"/></div>
                      <div class="order-last my-auto text-center col-lg-4 col-sm-12 col-12">
                          <div class="row">
                              <div class="text-lg-right col-sm-12 col-12">
                                  <a href=""><i class="fa fa-youtube-play social-icon pr-lg-0"></i></a>
                                  <a href="https://www.instagram.com/differentbreedlabs/"><i class="fa fa-instagram social-icon pr-lg-0"></i></a>
                                  <a href="https://discord.gg/uqnphDGK"><i class="fa fa-discord-alt social-icon pr-lg-0"></i></a>
                                  <a href="https://mobile.twitter.com/breed_labs"><i class="fa fa-twitter social-icon pr-lg-0"></i></a>
                              </div>
                              <div class="col-lg-12 col-sm-6 col-6">
                                  <p class="copyright text-right"><span class="copy-left">© 2022 Different Breed Labs</span>
                                  </p>
                              </div>
                              <div class="col-lg-12 col-sm-6 col-6">
                                  <p id="terms" class="copyright text-right">
                                      {/* <!-- <a class="link" href="">DBL Terms &amp;
                                          Conditions
                                      </a> --> */}
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="container-fluid m-0 p-0"><span class="last-line"></span></div>
          </footer>
      </div>
    </s.Screen>
  );
}

export default App;