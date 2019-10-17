import { Link } from 'gatsby'
import Img from 'gatsby-image'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const CaptionDiv = styled.div`
  color: #636c72;
  font-family: Poppins;
  font-size: 0.65rem;
  text-align: right;`

const PostImageCaption = (props) => {
  return (
    <div style={{ marginBottom: `1.5rem` }}>
      <Img style={{ marginBottom: `0.250rem` }} fluid={props.fluidImage}></Img>
      <CaptionDiv>
        {props.caption}&nbsp;
        <Link css={{ color: `#0275d8` }} to={props.captionHref}>{props.captionLink}</Link>
      </CaptionDiv>
    </div>
  )
}

PostImageCaption.propTypes = {
  caption: PropTypes.string.isRequired,
  captionHref: PropTypes.string.isRequired,
  captionLink: PropTypes.string.isRequired,
  fluidImage: PropTypes.object.isRequired,
}

export default PostImageCaption
