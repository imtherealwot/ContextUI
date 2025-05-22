import React from 'react'
import Layout from './Layout'
import StatsCard from './StatsCard'
import Upload from './UploadCard'
import Query from './Query'
import WordCloudCard from "./WordCloudCard";

export default function Dashboard() {
  return (
    <Layout>
      <section className="space-y-8">
        <Query />
        <StatsCard />
        <WordCloudCard />
        <Upload />
      </section>
    </Layout>
  )
}