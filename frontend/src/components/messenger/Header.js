import { useAppContext } from "../../context/context";

import { useEffect, useState } from "react";

import { HiOutlineUserAdd } from "react-icons/hi";
import { AiOutlineSetting } from "react-icons/ai";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { HiOutlineUser } from "react-icons/hi";
import { IoLogoBuffer } from "react-icons/io";


const Header = () => {
  const { currentUser, showAddUser, setShowAddUser } = useAppContext() ;

    return (
      <header className="header-section header">
        <div className="logo">
          <IoLogoBuffer />
        </div>
        <div>
          <ul>
            <li>
              <span onClick={() => setShowAddUser(!showAddUser)}>
                <HiOutlineUserAdd />
              </span>
            </li>
            <li>
              <span>
                <AiOutlineSetting />
              </span>
            </li>
            <li>
              <span>
                <AiOutlineQuestionCircle />
              </span>
            </li>
            <li>
              <span>
                <img src={currentUser.avatar} alt={"Ram"} />
              </span>
            </li>
          </ul>
        </div>
      </header>
    )
};

export default Header;
