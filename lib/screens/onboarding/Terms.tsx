import * as React from 'react'
import { Screen, Container, Text, NavBar } from '@kancha'
import termsConditions from 'xdemic/lib/content/termsContent.json'

/**
 * Terms screen. The terms component could be extracted so it can be used in the setting also
 */
interface TermsProps {}

const TermsScreen: React.FC<TermsProps> = props => {
  return (
    <Screen statusBarHidden type={Screen.Types.Primary} config={Screen.Config.Scroll}>
      <TermsComponent termsContent={termsConditions} />
    </Screen>
  )
}

export default TermsScreen

/**
 * Terms component
 */
interface TermComponentProps {
  termsContent: any
}

const TermsComponent: React.FC<TermComponentProps> = ({ termsContent }) => {
  return (
    <Container padding>
      <Text type={Text.Types.H2} bold>
        {termsContent.name}
      </Text>
      <Text type={Text.Types.SubTitle}>{termsContent.version}</Text>
      <Container paddingTop paddingBottom>
        <Text>{termsContent.notice}</Text>
      </Container>
      <Container paddingTop paddingBottom>
        <Text>{termsContent.summary}</Text>
      </Container>
      {termsContent.sections.map((section: any) => {
        return (
          <Container key={section.section}>
            <Container>
              <Text bold type={Text.Types.H3} paddingBottom>
                {section.title}
              </Text>
            </Container>
            {section.clauses.map((clause: any) => {
              return (
                <Container paddingBottom key={clause.number}>
                  {section.clauses.length > 1 && clause.title && (
                    <Text bold>
                      {clause.number} {clause.title}
                    </Text>
                  )}
                  <Text>{clause.content}</Text>
                </Container>
              )
            })}
          </Container>
        )
      })}
    </Container>
  )
}
