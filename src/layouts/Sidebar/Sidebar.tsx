import React, { memo, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SidebarStyled } from "./styled";

import { Layout, Menu } from "antd";
import clsx from "clsx";
import { sidebarMenus } from "@/utill/createSideMenu";

import Cookies from "js-cookie";

export interface SidebarProps {
  className?: string;
  children?: ReactNode;
}

const Sidebar = ({ className, children }: SidebarProps) => {
  const router = useRouter();
  const [token, setToken] = useState<string | undefined>(undefined);
  const t = Cookies.get("accessToken");

  useEffect(() => {
    setToken(t);
  }, [t]);

  return (
    // 토큰 없을 시 관리자 사이드바 안보이는 설정
    <SidebarStyled
      className={clsx(token ? "Sidebar" : "SidebarOff", className)}
    >
      <div>
        {/*
        // @ts-ignore */}
        <Layout>
          <Layout.Sider width={200}>
            <Menu
              mode="inline"
              items={sidebarMenus}
              selectedKeys={[router.pathname]}
              defaultOpenKeys={router.pathname.split("/").slice(1, -1)}
              style={{ height: "100%", borderRight: 0 }}
            />
          </Layout.Sider>

          <Layout style={{ marginLeft: 200 }}>
            <Layout.Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <div style={{ padding: "24px" }}>{children}</div>
            </Layout.Content>
          </Layout>
        </Layout>
      </div>
    </SidebarStyled>
  );
};

export default memo(Sidebar);
