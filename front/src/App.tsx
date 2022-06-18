import './App.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {Col, Layout, Menu, MenuProps, Row} from "antd";
import CategoriesComponent from './components/Categories';
import CalendarComponent from './components/Calendar';
import HomeComponent from './components/Home';
import {BarsOutlined, HomeOutlined, CalendarOutlined} from "@ant-design/icons";
import { MenuInfo } from 'rc-menu/lib/interface';


const { Header, Content } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  title: string,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    label,
    title,
    key,
    icon,
    children
  } as MenuItem
}

const App: React.FC = () => {

  let navigate = useNavigate();
  const location = useLocation();

  const onClick: MenuProps['onClick'] = (e: MenuInfo) => {
    navigate(e.key);
  };

  const items: MenuItem[] = [
    getItem(
      'Home',
      'Home',
      '/',
      <HomeOutlined/>
    ),
    getItem(
      'Categories',
      'Categories',
      '/categories',
      <BarsOutlined/>
    ),
    getItem(
      'Calendar',
      'Calendar',
      '/calendar',
      <CalendarOutlined/>
    )
  ];

  return (
    <Layout>
      <Header style = {{backgroundColor: "white", width: '100%'}}>
        <Row>
          <Col span = {14}>
            <Menu
              onClick = {onClick}
              defaultOpenKeys = {['/']}
              selectedKeys = {[location.pathname]}
              mode = "horizontal"
              items = {items}>
            </Menu>
          </Col>
        </Row>
      </Header>

      <Content className="site-layout" style={{padding: '0 50px', marginTop: 64}}>
        <div className="site-layout-background" style={{margin: '25px 0', padding: 24, minHeight: 380, height: "80vh"}}>
          <Routes>
            <Route path = {""} element = {<HomeComponent />} />
            <Route path = {"/"} element = {<HomeComponent />} />
            <Route path = {"categories/"} element = {<CategoriesComponent />} />
            <Route path = {"calendar/"} element = {<CalendarComponent />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
};

export default App;
