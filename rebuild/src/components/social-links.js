import React from 'react'
import { FaGithub, FaLinkedinIn, FaStackOverflow } from 'react-icons/fa'
import styled from 'styled-components'

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

const SocialLink = styled.a`
  & svg {
    fill: #adadad;
  }

  &:hover svg {
    fill: #5a5a5a;
  }
`

const SocialLinks = () => (
  <SocialList>
    <li>
      <SocialLink
        href='https://www.linkedin.com/in/rolandoramosrestrepo/'
        rel='noopener' target='_blank'>
        <FaLinkedinIn />
      </SocialLink>
    </li>
    <li>
      <SocialLink
        href='https://github.com/rolspace'
        rel='noopener' target='_blank'>
        <FaGithub />
      </SocialLink>
    </li>
    <li>
      <SocialLink
        href='https://stackoverflow.com/users/6909765/rolspace'
        target='_blank' rel='noopener'>
        <FaStackOverflow />
      </SocialLink></li>
  </SocialList>
)

export default SocialLinks
