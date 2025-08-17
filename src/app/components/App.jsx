// src/App.jsx
import styled from 'styled-components';

const Container = styled.div`
  padding: 0;
  margin: 0;
  background-color: #1a1a2e;
  color: #e0e0e0;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Roboto,
    sans-serif;
`;

const Link = styled.a`
  color: #00bcd4;
  text-decoration: none;
  transition: color 0.3s ease;
  &:hover {
    color: #0097a7;
  }
`;

export default function App() {
  return (
    <Container>
      <h1>Welcome</h1>
      <Link href="#">Click me</Link>
    </Container>
  );
}
