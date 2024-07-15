"use client";

import { Layout } from "antd";
import Nav from "@/app/Nav";
import Footer from "./Footer";

export default function MainLayout({ children }) {
    return (
        <Layout
            style={{
                minHeight: "100vh",
                scrollbarGutter: "stable",
                overflowX: "hidden",
            }}
        >
            <Layout.Header>
                <Nav />
            </Layout.Header>
            <Layout.Content>{children}</Layout.Content>
            <Layout.Footer className="!p-0">
                <Footer />
            </Layout.Footer>
        </Layout>
    );
}
