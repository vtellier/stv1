import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

const FileList = ({ data, pageContext }) => (
<Layout context={ pageContext }>
    <SEO title="FileList" />
    <h1>File list</h1>
    <table>
        <thead>
            <tr>
                <th>relativePath</th>
                <th>prettySize</th>
                <th>extension</th>
                <th>birthTime</th>
            </tr>
        </thead>
        <tbody>
            {data.allFile.edges.map(({ node }, index) => (
              <tr key={index}>
                <td>{node.relativePath}</td>
                <td>{node.prettySize}</td>
                <td>{node.extension}</td>
                <td>{node.birthTime}</td>
              </tr>
            ))}
        </tbody>
    </table>
    <Link to="/">Go back to the homepage</Link>
</Layout>
)

export default FileList

export const query = graphql`
  query {
    allFile {
      edges {
        node {
          relativePath
          prettySize
          extension
          birthTime(fromNow: true)
        }
      }
    }
  }
`

