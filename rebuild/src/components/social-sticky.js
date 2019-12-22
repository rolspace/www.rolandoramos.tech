import React from 'react'
import { FaGithub, FaLinkedinIn, FaStackOverflow } from 'react-icons/fa'
import styled from 'styled-components'
import SocialLink from './common/social-link'

const SocialList = styled.ul`
  display: none;

  @media (min-width: 56em) {
    display: block;
    font-size: 1.10rem;
    list-style-type: none;
    margin-top: 80px;
    padding: 0 0 0 30px;
    perspective: 1000px;
    position: fixed;

    & li {
      padding-bottom: 15px;
    }
  }`

const SocialSticky = () => (
  <SocialList>
    <li>
      <SocialLink>
        <FaLinkedinIn />
      </SocialLink>
    </li>
    <li>
      <SocialLink>
        <FaGithub />
      </SocialLink>
    </li>
    <li>
      <SocialLink>
        <FaStackOverflow />
      </SocialLink>
    </li>
  </SocialList>
)

export default SocialSticky
