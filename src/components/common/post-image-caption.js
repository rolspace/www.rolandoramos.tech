import { GatsbyImage } from 'gatsby-plugin-image'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const CaptionDiv = styled.div`
  color: #636c72;
  font-family: Poppins;
  font-size: 0.65rem;
  text-align: right;
`

const PostImageCaption = (props) => {
  return (
    <div style={{ marginBottom: `1.0rem` }}>
      <GatsbyImage
        image={props.image.childImageSharp.gatsbyImageData}
        style={{ marginBottom: `0.250rem` }}
      />
      {props.caption ? (
        <CaptionDiv>
          {console.log(props)}
          {props.caption}&nbsp;
          <a style={{ color: '#0275d8' }} href={props.captionHref}>
            {props.captionLink}
          </a>
        </CaptionDiv>
      ) : (
        ''
      )}
    </div>
  )
}

PostImageCaption.propTypes = {
  caption: PropTypes.string,
  captionHref: PropTypes.string,
  captionLink: PropTypes.string,
  image: PropTypes.object,
}

export default PostImageCaption
