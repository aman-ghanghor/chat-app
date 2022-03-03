import {useState, useEffect} from "react" ;
import { useAppContext } from "../../context/context";

import { RiCloseLine } from "react-icons/ri";
import { IoStar } from "react-icons/io5";
import { HiBell } from "react-icons/hi";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { MdOutlineBlock } from "react-icons/md";
import { MdThumbDown } from "react-icons/md";
import { MdDelete } from "react-icons/md";

import media1 from "../../assets/images/media1.jpg";
import media2 from "../../assets/images/media2.jpg";
import media3 from "../../assets/images/media3.jpg";

import SwitchToggler from "../other/SwitchToggler";

const RightSection = () => {
  const {setShowContactInfo, otherUser } = useAppContext();
  const {firstname, lastname, username, avatar, about } = otherUser ;

  return (
    <section className="right-section rightbar">
      <div className="contact-title">
        <span className="close" onClick={() => setShowContactInfo(false)}>
          <RiCloseLine />
        </span>
        <h3>Contact info</h3>
      </div>
      <div className="contact-info styled-scrollbar">
        <div className="profile">
          <img src={avatar} alt="profile" className="avatar" />
          <span className="name">{`${firstname} ${lastname}`}</span>
          <p className="phone">{username}</p>
        </div>
        <div className="about">
          <p>About</p>
          <span> {about} </span>
        </div>
        <div className="media">
          <div>
            <p>Media and Docs</p>
            <span>
              <MdOutlineArrowForwardIos />
            </span>
          </div>
          <div>
            <img src={media1} alt="media" />
            <img src={media2} alt="media" />
            <img src={media3} alt="media" />
          </div>
        </div>
        <div className="starred info">
          <span className="center-icon">
            <IoStar />
          </span>
          <p>Starred messages</p>
          <span className="center-icon">
            <MdOutlineArrowForwardIos />
          </span>
        </div>
        <div className="notification info">
          <span className="center-icon">
            <HiBell />
          </span>
          <p>Mute notifacations</p>
          <SwitchToggler />
        </div>
        <div className="block info danger">
          <span className="center-icon">
            <MdOutlineBlock />
          </span>
          <p>Block {`${firstname} ${lastname}`}</p>
          <span></span>
        </div>
        <div className="report info danger">
          <span className="center-icon">
            <MdThumbDown />
          </span>
          <p>Report {`${firstname} ${lastname}`}</p>
          <span></span>
        </div>
        <div className="delete info danger">
          <span className="center-icon">
            <MdDelete />
          </span>
          <p>Delete chat</p>
          <span></span>
        </div>
      </div>
    </section>
  );
};

export default RightSection;
