import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function ReturnPolicy({ navigation }) {
  return (
    <>
      <View style={styles.wrapper}>
        {/* ✅ Watermark Logo */}
        <Image
          source={require('../assets/hirelink.png')}
          style={styles.watermark}
          resizeMode="contain"
        />

        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Terms & Conditions</Text>

          <Text style={styles.heading}>Objective</Text>
          <Text style={styles.text}>
            Hirelink Infotech Pvt Ltd and its Affiliated Products serves solely
            as an initial platform for communication and information exchange
            among its users, members, and visitors who genuinely intend to
            connect regarding actual job openings and other legitimate career
            development services. Please read these conditions carefully before
            using the Hirelink Infotech Pvt Ltd and its Affiliated Products.
          </Text>

          <Text style={styles.heading}>CONDITIONS OF USE</Text>
          <Text style={styles.text}>
            1) If you use the website, you are responsible for maintaining the
            confidentiality of your account and password and for restricting
            access to your computer to prevent unauthorized access to your
            account. You agree to accept responsibility for all activities that
            occur under your account or password. You should take all necessary
            steps to ensure that the password is kept confidential and secure.
            Please ensure that the details you provide us with are correct and
            complete. Any service or product of Hirelink Infotech Pvt Ltd and
            its Affiliated Products that you subscribe to or use (whether paid
            or free) is intended exclusively for the stated Objective and for
            the personal use of the registered subscriber/user. Reproducing,
            duplicating, copying, downloading, recreating, sharing passwords,
            sublicensing, or distributing in any way that deviates from these
            terms constitutes misuse of the platform, service, or product.
            Hirelink Infotech Pvt Ltd and its Affiliated Products reserves the
            right to take appropriate measures to safeguard its revenue,
            reputation, or to claim damages, including suspending or terminating
            access and reporting to relevant authorities.
          </Text>

          <Text style={styles.text}>
            2)If you are found Copy, extracting, misusing, transmitting, or
            crawling data, photographs, graphics, or any information from
            Hirelink Infotech Pvt Ltd and its Affiliated Products for purposes
            other than the bona fide Objective, the company reserves the right
            to take suitable action, including blocking access and seeking
            damages.
          </Text>

          <Text style={styles.text}>
            3)The platform is a public site with paid access, and Hirelink
            Infotech Pvt Ltd and its Affiliated Products accepts no
            responsibility for the authenticity or quality of responses
            received. The company cannot oversee responses that individuals may
            receive based on information they have posted. Users/companies must
            independently verify the legitimacy of all responses.
          </Text>

          <Text style={styles.text}>
            The candidate signup fee of ₹300 is non-refundable once the account
            is created and access to the platform is provided.
          </Text>

          <Text style={styles.text}>
            4)You authorise Hirelink Infotech Pvt Ltd and its Affiliated
            Products to utilize information about your activities on the
            platform in relation to advertisements, offers, and other content
            (sponsored or otherwise) displayed across its services, without any
            compensation to you. Such data may be used to provide relevant
            recommendations to you and others.
          </Text>

          <Text style={styles.text}>
            5)The platform may include links to third-party websites. These are
            provided only for your convenience, and their inclusion does not
            imply endorsement of their content. Accessing such sites is entirely
            at your own risk.
          </Text>

          <Text style={styles.text}>
            6)You are required to provide only accurate and truthful information
            when using the platform, and if creating a profile, you agree to
            keep it current at all times. Hirelink Infotech Pvt Ltd and its
            Affiliated Products bear no liability for any inaccuracies on the
            site. Visitors are responsible for further verifying information.
            The company is not accountable for any breach of privacy or misuse
            of information provided by users through technical or other means,
            and does not guarantee confidentiality of data shared on its
            websites or domains.
          </Text>

          <Text style={styles.text}>
            7)Hirelink Infotech Pvt Ltd and its Affiliated Products does not
            disclose personally identifiable information to other entities
            without consent, except to its agents or in response to legal
            requirements such as court orders or subpoenas. Users must not use
            the services in a way that harms the interests or operations of
            Hirelink Infotech Pvt Ltd and its Affiliated Products. Users are
            prohibited from duplicating, downloading, publishing, modifying, or
            distributing material unless expressly permitted in writing.
          </Text>

          <Text style={styles.text}>
            8)Users agree to use the platform solely for personal purposes.
            Creating derivative works with commercial intent from content on
            Hirelink Infotech Pvt Ltd and its Affiliated Products without prior
            written approval is strictly forbidden.
          </Text>

          <Text style={styles.text}>
            9)Users must not send unsolicited bulk or commercial emails using
            the platform. Hirelink Infotech Pvt Ltd and its Affiliated Products
            reserves the right to monitor, filter, and block emails sent via its
            servers and to terminate services for violations, including
            forfeiture of any fees paid.
          </Text>

          <Text style={styles.text}>
            10)Users are prohibited from spamming the platform through repeated
            or indiscriminate posting of jobs or messages. Any such violation
            entitles Hirelink Infotech Pvt Ltd and its Affiliated Products to
            immediately terminate services without notice.
          </Text>

          <Text style={styles.text}>
            11)Users must not upload, post, transmit, publish, or distribute any
            material that is illegal, harmful, threatening, abusive, harassing,
            defamatory, libellous, vulgar, obscene, or racially, ethnically, or
            otherwise objectionable.
          </Text>

          <Text style={styles.text}>
            12)Users confirm that any resume, information, or data entered into
            the Hirelink Infotech Pvt Ltd and its Affiliated Products network is
            accurate, complete, and free from false, misleading, fraudulent, or
            distorted content. The company disclaims all liability arising from
            such submissions and users agree to assure Hirelink Infotech Pvt Ltd
            and its Affiliated Products against any losses resulting from
            inaccurate or objectionable content provided by them.
          </Text>

          <Text style={styles.text}>
            13)Users are solely responsible for the confidentiality of their
            password and user ID, and for all activities conducted through their
            account, including transactions involving credit/debit cards,
            UPI,ectc. Hirelink Infotech Pvt Ltd and its Affiliated Products
            accept no liability for improper use of such information.
          </Text>
          <Text style={styles.text}>
            14)Users agree to comply fully with the Information Technology Act,
            2000 and all related rules, regulations, and notifications when
            accessing or submitting data to the platform. Any violation makes
            the user solely liable for civil or criminal consequences.
          </Text>
          <Text style={styles.text}>
            15)Users are responsible for obtaining, at their own expense, all
            necessary licences, permits, consents, approvals, and intellectual
            property rights required for using the services.
          </Text>
          <Text style={styles.text}>
            16) You acknowledge and undertake that you are accessing the
            services on the website and transacting at your own risk and are
            using your best and prudent judgment before entering into any
            transactions through the website.
          </Text>
          <Text style={styles.text}>
            17)You shall not involve in accessing the platform to extract
            content for training machine learning.
          </Text>
          <Text style={styles.text}>
            18)You shall not Breach any applicable law, regulation, or
            ordinance.
          </Text>
          <Text style={styles.text}>
            19)You shall not Disrupt or interfere with networks connected to the
            platform.
          </Text>
          <Text style={styles.text}>
            20)You shall not Impersonate any person or entity or misrepresent
            affiliations.
          </Text>
          <Text style={styles.text}>
            21)You shall not Forge headers or manipulate identifiers to conceal
            the origin of information.
          </Text>
          <Text style={styles.text}>
            22) You shall not Harass, threaten, stalk, or disrupt other users.
          </Text>
          <Text style={styles.text}>
            23)You shall not Gain unauthorized access to others' computer
            systems.
          </Text>
          <Text style={styles.text}>
            24)You shall not exploit the platform or its components for
            commercial purposes without permission, including reproducing,
            copying, modifying, selling, storing, or distributing content.
          </Text>
          <Text style={styles.text}>
            25)You shall not Use site content for commercial derivative works
            without prior written consent.
          </Text>
          <Text style={styles.text}>
            26)You shall not employ devices, software, or routines that
            interfere with the platform's proper functioning.
          </Text>
          <Text style={styles.text}>
            27)You shall not impose an excessive load on the platform's
            infrastructure.
          </Text>
          <Text style={styles.text}>
            28)You shall not Spam the platform through repeated or
            indiscriminate content posting.
          </Text>
          <Text style={styles.text}>
            29)You shall not Access data or accounts not intended for you.
          </Text>
          <Text style={styles.text}>
            30)You shall not Reverse engineer, decompile, disassemble, or
            attempt to derive source code.
          </Text>
          <Text style={styles.text}>
            31)You shall not Frame, mirror, or simulate the platform's
            appearance or functionality.
          </Text>
          <Text style={styles.text}>
            {' '}
            32)You shall not Probe, scan, or test system/network
            vulnerabilities.
          </Text>
          <Text style={styles.text}>
            {' '}
            33)You shall not Use automated or manual means to crawl or scrape
            content.
          </Text>
          <Text style={styles.text}>
            {' '}
            34)You shall not bypass technological measures designed to prevent
            robots from crawling or scraping.
          </Text>
          <Text style={styles.text}>
            {' '}
            35)You shall not Access the platform other than through provided
            interfaces.
          </Text>
          <Text style={styles.text}>
            36)You shall not Breach security or authentication measures without
            authorization.
          </Text>
          <Text style={styles.text}>
            37)You shall not provide deep links without permission or extract
            data via unauthorized automated or manual processes.
          </Text>
          <Text style={styles.text}>
            38)You shall not send unsolicited bulk or commercial emails.
          </Text>
          <Text style={styles.text}>
            39)You shall not Sublicense, assign, or transfer any license.
          </Text>
          <Text style={styles.text}>
            40)You shall not Host, modify, upload, post, transmit, publish, or
            distribute material for which you lack necessary rights or licenses.
          </Text>
          <Text style={styles.text}>
            {' '}
            41)You shall not perform any activity that infringes third-party
            rights, including copyright, trademark, privacy, or proprietary
            rights.
          </Text>
          <Text style={styles.text}>
            {' '}
            42)You shall not perform any activity that Contains viruses or code
            intended to disrupt operations.
          </Text>
          <Text style={styles.text}>
            43)You shall not perform any activity that is harmful, harassing,
            hateful, invasive of privacy, or otherwise unlawful.
          </Text>
          <Text style={styles.text}>
            {' '}
            44)You shall not perform any activity that encourages criminal
            conduct or violates laws.
          </Text>
          <Text style={styles.text}>
            45)You shall not perform any activity that is deceptive, offensive,
            or menacing.
          </Text>
          <Text style={styles.text}>
            {' '}
            46)You shall not perform any activity that belongs to others without
            rights.
          </Text>
          <Text style={styles.text}>
            {' '}
            47)You shall not perform any activity that threatens India's unity,
            integrity, security, sovereignty, public order, or international
            relations.
          </Text>
          <Text style={styles.text}>
            {' '}
            48)You shall not perform any activity that infringe intellectual
            property rights or retain information with intent to do so.
          </Text>
          <Text style={styles.text}>
            Hirelink Infotech Pvt Ltd and its Affiliated Products strive to
            ensure error-free operation but do not warrant absence of viruses,
            contaminants, or operational issues. Subscriptions are subject to
            applicable quotas. Provided email addresses must be genuine and
            accessible only to authorized personnel. Clients must use only
            domain-owned email addresses for registration and activities.
            Violation may result in suspension or termination.
          </Text>

          <Text style={styles.heading}>SECURITY MEASURES</Text>

          <Text style={styles.text}>
            To safeguard accounts and services, automated and manual checks
            detect unusual activity. Elevated risk may require additional
            verification, including installation of a security application with
            your consent. Refusal may limit access. The application may use
            biometric, photo, SMS, or other authentication methods. Limited data
            may be shared with fraud prevention providers. You may request human
            review of automated decisions via support; the final decision is
            binding. You agree to install updates, maintain device security, and
            not tamper with features.
            {'\n\n'}
            By registering, you consent to receiving SMS verification codes and
            security messages. Standard rates apply. You confirm ownership of
            the provided mobile number and responsibility for device/SIM
            security. Do not share codes. Delivery issues are beyond control.
            {'\n\n'}
            Hirelink Infotech Pvt Ltd and its Affiliated Products is not liable
            for inadvertent disclosure of account or transaction information,
            errors in legal processes, or related issues.
          </Text>

          <Text style={styles.heading}>Payment</Text>

          <Text style={styles.text}>
            Payments are 100% in advance. Refunds are at the company's sole
            discretion, with no guarantees on timeliness. No warranties are
            provided for uptime or functionality; liability is limited to
            refunds. Free services carry no liability. Terms may be amended
            without prior notice.
            {'\n\n'}
            Performance obligations are limited to providing portal access for
            the subscription period. Usage limits do not create additional
            obligations.
            {'\n\n'}
            The company may set off amounts owed against payments due under
            other agreements.
            {'\n\n'}
            Data may be posted on affiliated sites at no extra cost.
            {'\n\n'}
            Subscriptions do not confer exclusivity or constitute non-poach
            agreements, as the platform is public.
            {'\n\n'}
            The company will not participate in disputes between users and third
            parties contracted via the site but will comply with court orders.
            Costs from involvement will be recovered from the initiating party.
            The platform operates from Nashik, India; users from other locations
            are responsible for local compliance.
            {'\n\n'}
            Violations of these Terms render users liable to civil and criminal
            action.
            {'\n\n'}
            You agree to indemnify and hold harmless Hirelink Infotech Pvt Ltd
            and its Affiliated Products, its directors, officers, employees,
            agents, subsidiaries, affiliates, and partners from any damages
            arising from your use of the services or information provided.
            {'\n\n'}
            Disputes shall be resolved through arbitration in Nashik under the
            Arbitration & Conciliation Act, 1996, with governing law being
            Indian law and exclusive jurisdiction in Nashik courts.
            {'\n\n'}
            Non-compliance may lead to termination of access and removal of
            content.
          </Text>

          <Text style={styles.footer}>
            © {new Date().getFullYear()} All Rights Reserved
          </Text>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },

  // ✅ watermark logo background
  watermark: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    width: '80%',
    height: 250,
    opacity: 0.5,
    zIndex: 0,
  },

  container: {
    padding: 16,
    paddingBottom: 40,
    zIndex: 1,
  },

  title: {
    textAlign: 'center',
    color: '#111827',
    marginBottom: 18,
    fontSize: 24,
    fontWeight: '900',
  },

  heading: {
    marginTop: 18,
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
  },

  text: {
    color: '#000',
    lineHeight: 22,
    fontSize: 14,
    marginTop: 8,
  },

  bullet: {
    color: '#000',
    fontSize: 14,
    marginTop: 6,
    marginLeft: 8,
    lineHeight: 20,
  },

  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 13,
    color: '#111827',
    fontWeight: '700',
  },
});
