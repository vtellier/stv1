import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

const NotFoundPage = ({ pageContext }) => {
    console.log(pageContext);
    return (
        <Layout context={ pageContext }>
            <SEO title="404: Not found" />
            <h1>NOT FOUND</h1>
            {pageContext.locale}
            <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
        </Layout>
    );
}

export default NotFoundPage
