import React from "react";
import coinguardlogo from "../coinguardlogo.png";

import { Button } from "antd";
import { useNavigate } from "react-router-dom";




function Home() {

  const navigate = useNavigate();

  return (
    <>
      <div className="content">

        <img src={coinguardlogo} alt="logo" className="frontPageLogo" />
        <div style={{ height: "1000px" }}></div>

        <div  className="buttonContainer">
          <Button
            onClick={() => navigate("/yourwallet")}
            className="frontPageButton"
            type="primary"
          >
            Create A Wallet
          </Button>
          <Button
            onClick={() => navigate("/recover")}
            className="frontPageButton"
            type="default"
          >
            Sign In With Seed Phrase
          </Button>
        </div>
        
      </div>
    </>
  );
}

export default Home;
