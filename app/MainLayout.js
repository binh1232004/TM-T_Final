'use client';

import { Layout } from "antd";
import Nav from "@/app/Nav";

export default function MainLayout({children}) {
    return <Layout style={{minHeight: "100vh"}}>
        <Layout.Header>
            <Nav />
        </Layout.Header>
        <Layout.Content>
            {children}
        </Layout.Content>
    </Layout>
}