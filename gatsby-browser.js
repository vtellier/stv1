/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from "react"
import Layout from "./src/components/layout"
import CssBaseline from '@material-ui/core/CssBaseline';

export const wrapPageElement = ({ element, props }) => {
    // props provide same data to Layout as Page element will get
    // including location, data, etc - you don't need to pass it
    return (
        <React.Fragment>
            <CssBaseline />
            <Layout {...props}>{element}</Layout>
        </React.Fragment>
    );
}
