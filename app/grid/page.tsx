import Row from "@/components/Row";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import Column from "@/components/Column";

export default function Home() {
  return (
    <>
      <PageHeader>
        <h1 className="h2">intelligence, not artificial</h1>
      </PageHeader>
      <div className="hero">
        <Container>
          <h2>Static Columns</h2>

          <Row>
            <Column xs="1">1</Column>
            <Column xs="1">1</Column>
            <Column xs="1">1</Column>
            <Column xs="1">1</Column>
            <Column xs="1">1</Column>
            <Column xs="1">1</Column>
            <Column xs="1">1</Column>
            <Column xs="1">1</Column>
            <Column xs="1">1</Column>
            <Column xs="1">1</Column>
            <Column xs="1">1</Column>
            <Column xs="1">1</Column>
          </Row>

          <Row>
            <Column xs="2">2</Column>
            <Column xs="2">2</Column>
            <Column xs="2">2</Column>
            <Column xs="2">2</Column>
            <Column xs="2">2</Column>
            <Column xs="2">2</Column>
          </Row>

          <Row>
            <Column xs="3">3</Column>
            <Column xs="3">3</Column>
            <Column xs="3">3</Column>
            <Column xs="3">3</Column>
          </Row>

          <Row>
            <Column xs="4">4</Column>
            <Column xs="4">4</Column>
            <Column xs="4">4</Column>
          </Row>

          <Row>
            <Column xs="6">6</Column>
            <Column xs="6">6</Column>
          </Row>

          <Row>
            <Column xs="12">12</Column>
          </Row>

          <h2>Responsive Columns</h2>

          <Row>
            <Column sm="6" md="4" lg="3" xl="2" xxl="1">
              1
            </Column>
            <Column sm="6" md="4" lg="3" xl="2" xxl="1">
              1
            </Column>
            <Column sm="6" md="4" lg="3" xl="2" xxl="1">
              1
            </Column>
            <Column sm="6" md="4" lg="3" xl="2" xxl="1">
              1
            </Column>
            <Column sm="6" md="4" lg="3" xl="2" xxl="1">
              1
            </Column>
            <Column sm="6" md="4" lg="3" xl="2" xxl="1">
              1
            </Column>
            <Column sm="6" md="4" lg="3" xl="2" xxl="1">
              1
            </Column>
            <Column sm="6" md="4" lg="3" xl="2" xxl="1">
              1
            </Column>
            <Column sm="6" md="4" lg="3" xl="2" xxl="1">
              1
            </Column>
            <Column sm="6" md="4" lg="3" xl="2" xxl="1">
              1
            </Column>
            <Column sm="6" md="4" lg="3" xl="2" xxl="1">
              1
            </Column>
            <Column sm="6" md="4" lg="3" xl="2" xxl="1">
              1
            </Column>
          </Row>
        </Container>
      </div>
    </>
  );
}
