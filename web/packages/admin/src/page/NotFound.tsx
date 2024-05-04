import { Link } from "react-router-dom";
import { Result } from "antd";

export function NotFound() {
    return <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Result
            status="404"
            title="404"
            subTitle="您访问的页面不存在."
            extra={<Link to="/">返回首页</Link>}
        />
    </div>
}