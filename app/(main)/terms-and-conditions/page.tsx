import Link from 'next/link';

export default function TermsAndConditionsPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-12 text-text-chocolate">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-bold text-text-chocolate hover:text-primary transition-colors mb-8"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Back to home
      </Link>

      <h1 className="font-black text-3xl md:text-4xl uppercase tracking-wide text-text-chocolate border-b-4 border-text-chocolate pb-4 mb-8">
        Terms and Conditions
      </h1>
      <p className="text-sm font-bold text-text-chocolate/70 mb-10">Last Updated: February 25, 2026</p>

      <div className="space-y-8 font-medium text-text-chocolate/90">

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Agreement to Terms
          </h2>
          <p>
            These Terms and Conditions constitute a legally binding agreement made between you,
            whether personally or on behalf of an entity (&quot;you&quot;) and Snacqo (&quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;), concerning your access to and use of https://snacqo.com as well as any other
            media form, media channel, mobile website, or mobile application related, linked, or
            otherwise connected thereto (collectively, the &quot;Site&quot;).
          </p>
          <p className="mt-3">
            You agree that by accessing the Site, you have read, understood, and agree to be bound
            by all of these Terms and Conditions. If you do not agree with all of these Terms and
            Conditions, then you are expressly prohibited from using the Site and you must
            discontinue use immediately.
          </p>
          <p className="mt-3">
            Supplemental terms and conditions or documents that may be posted on the Site from
            time to time are hereby expressly incorporated herein by reference. We reserve the
            right, in our sole discretion, to make changes or modifications to these Terms and
            Conditions at any time and for any reason.
          </p>
          <p className="mt-3">
            We will alert you about any changes by updating the &quot;Last Updated&quot; date of these Terms
            and Conditions, and you waive any right to receive specific notice of each such change.
            It is your responsibility to periodically review these Terms and Conditions to stay
            informed of updates.
          </p>
          <p className="mt-3">
            The information provided on the Site is not intended for distribution to or use by any
            person or entity in any jurisdiction or country where such distribution or use would be
            contrary to law or regulation. Accordingly, those persons who choose to access the Site
            from other locations do so on their own initiative and are solely responsible for
            compliance with local laws, if and to the extent local laws are applicable.
          </p>
          <p className="mt-3">
            The Site is intended for users who are at least 13 years of age. All users who are
            minors in the jurisdiction in which they reside (generally under the age of 18) must
            have the permission of, and be directly supervised by, their parent or guardian to use
            the Site.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Intellectual Property Rights
          </h2>
          <p>
            Unless otherwise indicated, the Site is the proprietary property of Snacqo and all
            source code, databases, functionality, software, website designs, audio, video, text,
            photographs, and graphics on the Site (collectively, the &quot;Content&quot;) and the
            trademarks, service marks, and logos contained therein (the &quot;Marks&quot;) are owned or
            controlled by us or licensed to us and are protected by applicable intellectual
            property and copyright laws of India.
          </p>
          <p className="mt-3">
            The Content and the Marks are provided on the Site &quot;AS IS&quot; for your information and
            personal use only. No part of the Site and no Content or Marks may be copied,
            reproduced, republished, uploaded, posted, transmitted, distributed, sold, licensed, or
            otherwise exploited for any commercial purpose without our express prior written
            permission.
          </p>
          <p className="mt-3">
            Provided that you are eligible to use the Site, you are granted a limited license to
            access and use the Site and to download or print a copy of any portion of the Content
            to which you have properly gained access solely for your personal, non-commercial use.
            We reserve all rights not expressly granted to you in and to the Site, the Content,
            and the Marks.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            User Registration
          </h2>
          <p>
            You may be required to register with the Site to purchase products. You agree to keep
            your password confidential and will be responsible for all use of your account and
            password. We reserve the right to remove or change a username if we determine it is
            inappropriate or objectionable.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            User Representations
          </h2>
          <p>By using the Site, you represent and warrant that:</p>
          <ol className="list-decimal pl-6 space-y-2 mt-4">
            <li>all registration information you submit will be true, accurate, current, and complete;</li>
            <li>you will maintain the accuracy of such information and promptly update such registration information as necessary;</li>
            <li>you have the legal capacity, and you agree to comply with these Terms and Conditions;</li>
            <li>you are not under the age of 13;</li>
            <li>not a minor in the jurisdiction in which you reside, or if a minor, you have received parental permission to use the Site;</li>
            <li>you will not access the Site through automated or non-human means, whether through a bot, script, or otherwise;</li>
            <li>you will not use the Site for any illegal or unauthorised purpose;</li>
            <li>your use of the Site will not violate any applicable law or regulation.</li>
          </ol>
          <p className="mt-4">
            If you provide any information that is untrue, inaccurate, not current, or incomplete,
            we have the right to suspend or terminate your account and refuse any and all current
            or future use of the Site (or any portion thereof).
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Prohibited Activities
          </h2>
          <p>
            You may not access or use the Site for any purpose other than that for which we make
            the Site available. As a user of the Site, you agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
            <li>make any unauthorized use of the Site, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited emails, or creating user accounts by automated means or under false pretences.</li>
            <li>use a buying agent or purchasing agent to make purchases on the Site.</li>
            <li>use the Site to advertise or offer to sell goods and services.</li>
            <li>circumvent, disable, or otherwise interfere with security-related features of the Site, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Site and/or the Content contained therein.</li>
            <li>engage in unauthorized framing of or linking to the Site.</li>
            <li>trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
            <li>make improper use of our support services or submit false reports of abuse or misconduct.</li>
            <li>engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</li>
            <li>interfere with, disrupt, or create an undue burden on the Site or the networks or services connected to the Site.</li>
            <li>attempt to impersonate another user or person or use the username of another user.</li>
            <li>sell or otherwise transfer your profile.</li>
            <li>use any information obtained from the Site in order to harass, abuse, or harm another person.</li>
            <li>use the Site as part of any effort to compete with us or otherwise use the Site and/or the Content for any revenue-generating endeavour or commercial enterprise.</li>
            <li>decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Site.</li>
            <li>attempt to bypass any measures of the Site designed to prevent or restrict access to the Site, or any portion of the Site.</li>
            <li>harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Site to you.</li>
            <li>delete the copyright or other proprietary rights notice from any Content.</li>
            <li>copy or adapt the Site&apos;s software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.</li>
            <li>upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material that interferes with any party&apos;s uninterrupted use and enjoyment of the Site.</li>
            <li>upload or transmit any material that acts as a passive or active information collection or transmission mechanism, including clear graphics interchange formats (&quot;gifs&quot;), 1×1 pixels, web bugs, cookies, or other similar devices.</li>
            <li>use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Site.</li>
            <li>disparage, tarnish, or otherwise harm, in our opinion, us and/or the Site.</li>
            <li>use the Site in a manner inconsistent with any applicable laws or regulations.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            User-Generated Contributions
          </h2>
          <p>
            The Site may invite you to chat, contribute to, or participate in blogs, message boards,
            online forums, and other functionality, and may provide you with the opportunity to
            create, submit, post, display, transmit, perform, publish, distribute, or broadcast
            content and materials to us or on the Site, including but not limited to text,
            writings, video, audio, photographs, graphics, comments, suggestions, or personal
            information or other material (collectively, &quot;Contributions&quot;).
          </p>
          <p className="mt-3">
            When you create or make available any Contributions, you thereby represent and warrant
            that: the creation, distribution, transmission, public display, or performance, and the
            accessing, downloading, or copying of your Contributions do not and will not infringe
            the proprietary rights of any third party; your Contributions are not false, inaccurate,
            or misleading; your Contributions are not unsolicited or unauthorized advertising,
            promotional materials, pyramid schemes, chain letters, spam, or mass mailings; your
            Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libelous,
            slanderous, or otherwise objectionable; your Contributions do not ridicule, mock,
            disparage, intimidate, or abuse anyone; your Contributions do not violate any
            applicable law, regulation, or rule.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Purchases and Payment
          </h2>
          <p>
            We accept payments through third-party payment gateways including but not limited to
            Razorpay. All payments must be made in Indian Rupees (INR).
          </p>
          <p className="mt-3">
            You agree to provide current, complete, and accurate purchase and account information
            for all purchases made via the Site. We reserve the right to refuse or cancel any
            order at our sole discretion.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Contribution License
          </h2>
          <p>
            By posting your Contributions to any part of the Site, you automatically grant to us
            an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable,
            royalty-free, fully-paid, worldwide right and license to host, use, copy, reproduce,
            disclose, sell, resell, publish, broadcast, retitle, archive, store, cache, publicly
            perform, publicly display, reformat, translate, transmit, excerpt, and distribute such
            Contributions for any purpose, commercial, advertising, or otherwise, and to prepare
            derivative works of, or incorporate into other works, such Contributions.
          </p>
          <p className="mt-3">
            You waive all moral rights in your Contributions, and you warrant that moral rights
            have not otherwise been asserted in your Contributions. We do not assert any ownership
            over your Contributions. You retain full ownership of all of your Contributions and
            any intellectual property rights or other proprietary rights associated with your
            Contributions. We have the right, in our sole and absolute discretion, to edit,
            redact, re-categorize, pre-screen, or delete any Contributions at any time and for any
            reason, without notice.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Guidelines for Reviews
          </h2>
          <p>
            We may provide you with areas on the Site to leave reviews or ratings. When posting a
            review, you must comply with the following criteria:
          </p>
          <ol className="list-decimal pl-6 space-y-2 mt-4">
            <li>you should have firsthand experience with the person/entity being reviewed;</li>
            <li>your reviews should not contain offensive profanity, or abusive, racist, offensive, or hate language;</li>
            <li>your reviews should not contain discriminatory references based on religion, race, gender, national origin, age, marital status, sexual orientation, or disability;</li>
            <li>your reviews should not contain references to illegal activity;</li>
            <li>you should not be affiliated with competitors if posting negative reviews;</li>
            <li>you should not make any conclusions as to the legality of conduct;</li>
            <li>you may not post any false or misleading statements;</li>
            <li>you may not organize a campaign encouraging others to post reviews, whether positive or negative.</li>
          </ol>
          <p className="mt-4">
            We may accept, reject, or remove reviews at our sole discretion. Reviews are not
            endorsed by us and do not necessarily represent our opinions or the views of any of
            our affiliates or partners. We do not assume liability for any review or for any
            claims, liabilities, or losses resulting from any review.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Social Media
          </h2>
          <p>
            As part of the functionality of the Site, you may link your account with online
            accounts you have with third-party service providers (each such account, a
            &quot;Third-Party Account&quot;). By granting us access to any Third-Party Accounts, you
            understand that we may access, make available, and store any content that you have
            provided to and stored in your Third-Party Account so that it is available on and
            through the Site via your account.
          </p>
          <p className="mt-3">
            Please note that if a Third-Party Account or associated service becomes unavailable or
            our access to such Third-Party Account is terminated by the third-party service
            provider, then Social Network Content may no longer be available on and through the
            Site. <strong className="text-text-chocolate">Please note that your relationship with the
            third-party service providers associated with your Third-Party Accounts is governed
            solely by your agreement(s) with such third-party service providers.</strong>
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Submissions
          </h2>
          <p>
            You acknowledge and agree that any questions, comments, suggestions, ideas, feedback,
            or other information regarding the Site (&quot;Submissions&quot;) provided by you to us are
            non-confidential and shall become our sole property. We shall own exclusive rights,
            including all intellectual property rights, and shall be entitled to the unrestricted
            use and dissemination of these Submissions for any lawful purpose, commercial or
            otherwise, without acknowledgement or compensation to you.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Third-Party Websites and Content
          </h2>
          <p>
            The Site may contain links to other websites (&quot;Third-Party Websites&quot;) as well as
            articles, photographs, text, graphics, pictures, designs, music, sound, video,
            information, applications, software, and other content or items belonging to or
            originating from third parties (&quot;Third-Party Content&quot;). Such Third-Party Websites and
            Third-Party Content are not investigated, monitored, or checked for accuracy,
            appropriateness, or completeness by us, and we are not responsible for any Third-Party
            Websites accessed through the Site or any Third-Party Content posted on, available
            through, or installed from the Site.
          </p>
          <p className="mt-3">
            If you decide to leave the Site and access the Third-Party Websites or to use or
            install any Third-Party Content, you do so at your own risk. Any purchases you make
            through Third-Party Websites will be through other websites and from other companies,
            and we take no responsibility whatsoever in relation to such purchases which are
            exclusively between you and the applicable third party.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Advertisers
          </h2>
          <p>
            We allow advertisers to display their advertisements and other information in certain
            areas of the Site. If you are an advertiser, you shall take full responsibility for
            any advertisements you place on the Site and any services provided on the Site or
            products sold through those advertisements. Further, as an advertiser, you warrant and
            represent that you possess all rights and authority to place advertisements on the
            Site, including, but not limited to, intellectual property rights, publicity rights,
            and contractual rights.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Site Management
          </h2>
          <p>
            We reserve the right, but not the obligation, to: (1) monitor the Site for violations
            of these Terms and Conditions; (2) take appropriate legal action against anyone who,
            in our sole discretion, violates the law or these Terms and Conditions; (3) in our
            sole discretion and without limitation, refuse, restrict access to, limit the
            availability of, or disable any of your Contributions or any portion thereof; (4) in
            our sole discretion and without limitation, notice, or liability, to remove from the
            Site or otherwise disable all files and content that are excessive in size or are in
            any way burdensome to our systems; (5) otherwise manage the Site in a manner designed
            to protect our rights and property and to facilitate the proper functioning of the
            Site.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Copyright Infringements
          </h2>
          <p>
            We respect the intellectual property rights of others. If you believe that any
            material available on or through the Site infringes upon any copyright you own or
            control, please immediately notify us using the contact information provided below. A
            copy of your notification will be sent to the person who posted or stored the material
            addressed in the notification. Please be advised that you may be held liable for
            damages if you make material misrepresentations in a notification. If you are not sure
            that material located on or linked to by the Site infringes your copyright, you should
            consider first contacting an attorney.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Dispute Resolution
          </h2>
          <p>
            <strong className="text-text-chocolate">Informal Negotiations</strong> — To expedite
            resolution and control the cost of any dispute, controversy, or claim related to these
            Terms and Conditions (each a &quot;Dispute&quot;), the Parties agree to first attempt to
            negotiate any Dispute informally for at least 30 days before initiating mediation.
            Such informal negotiations commence upon written notice from one Party to the other
            Party.
          </p>
          <p className="mt-4">
            <strong className="text-text-chocolate">Binding Mediation</strong> — If the Parties are
            unable to resolve a Dispute through informal negotiations, the Dispute will be finally
            and exclusively resolved by binding mediation.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Corrections
          </h2>
          <p>
            There may be information on the Site that contains typographical errors, inaccuracies,
            or omissions that may relate to the Site, including descriptions, pricing, availability,
            and various other information. We reserve the right to correct any errors,
            inaccuracies, or omissions and to change or update the information on the Site at any
            time, without prior notice.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Disclaimer
          </h2>
          <p className="uppercase text-sm leading-relaxed">
            The Site is provided on an as-is and as-available basis. You agree that your use of
            the Site and our services will be at your sole risk. To the fullest extent permitted
            by law, we disclaim all warranties, express or implied, in connection with the Site
            and your use thereof, including, without limitation, the implied warranties of
            merchantability, fitness for a particular purpose, and non-infringement. We make no
            warranties or representations about the accuracy or completeness of the Site&apos;s
            content or the content of any websites linked to the Site and we will assume no
            liability or responsibility for any errors, mistakes, or inaccuracies of content and
            materials, personal injury or property damage, unauthorized access to our secure
            servers, any interruption or cessation of transmission to or from the Site, or any
            bugs, viruses, or Trojan horses transmitted through the Site by any third party.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Limitations of Liability
          </h2>
          <p className="uppercase text-sm leading-relaxed">
            In no event shall Snacqo or its representatives be liable for any indirect,
            incidental, consequential, special, or punitive damages arising from your use of the
            Site or purchase of products.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Indemnification
          </h2>
          <p>
            You agree to defend, indemnify, and hold us harmless, including our subsidiaries,
            affiliates, and all of our respective officers, agents, partners, and employees, from
            and against any loss, damage, liability, claim, or demand, including reasonable
            attorneys&apos; fees and expenses, made by any third party due to or arising out of: (1)
            your Contributions; (2) use of the Site; (3) breach of these Terms and Conditions;
            (4) any breach of your representations and warranties set forth in these Terms and
            Conditions; (5) your violation of the rights of a third party, including but not
            limited to intellectual property rights; or (6) any overt harmful act toward any other
            user of the Site with whom you connected via the Site.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            User Data
          </h2>
          <p>
            We will maintain certain data that you transmit to the Site for the purpose of
            managing the Site, as well as data relating to your use of the Site. Although we
            perform regular routine backups of data, you are solely responsible for all data that
            you transmit or that relates to any activity you have undertaken using the Site. You
            agree that we shall have no liability to you for any loss or corruption of any such
            data.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Term and Termination
          </h2>
          <p>
            These Terms and Conditions shall remain in full force and effect while you use the
            Site. We reserve the right, in our sole discretion and without notice or liability, to
            deny access to and use of the Site to any person for any reason, including without
            limitation for breach of any representation, warranty, or covenant contained in these
            Terms and Conditions or of any applicable law or regulation.
          </p>
          <p className="mt-3">
            If we terminate or suspend your account for any reason, you are prohibited from
            registering and creating a new account under your name, a fake or borrowed name, or
            the name of any third party. In addition to terminating or suspending your account, we
            reserve the right to take appropriate legal action, including without limitation
            pursuing civil, criminal, and injunctive redress.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Modifications and Interruptions
          </h2>
          <p>
            We reserve the right to change, modify, or remove the contents of the Site at any
            time or for any reason at our sole discretion without notice. We also reserve the
            right to modify or discontinue all or part of the Site without notice at any time. We
            will not be liable to you or any third party for any modification, price change,
            suspension, or discontinuance of the Site.
          </p>
          <p className="mt-3">
            We cannot guarantee the Site will be available at all times. We may experience
            hardware, software, or other problems or need to perform maintenance related to the
            Site, resulting in interruptions, delays, or errors. You agree that we have no
            liability whatsoever for any loss, damage, or inconvenience caused by your inability
            to access or use the Site during any downtime or discontinuance of the Site.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Electronic Communications
          </h2>
          <p>
            Visiting the Site, sending us emails, and completing online forms constitute
            electronic communications. You consent to receive electronic communications, and you
            agree that all agreements, notices, disclosures, and other communications we provide
            to you electronically, via email and on the Site, satisfy any legal requirement that
            such communication is in writing. You hereby agree to the use of electronic
            signatures, contracts, orders, and other records, and to the electronic delivery of
            notices, policies, and records of transactions initiated or completed by us or via
            the Site.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Miscellaneous
          </h2>
          <p>
            These Terms and Conditions and any policies or operating rules posted by us on the
            Site constitute the entire agreement and understanding between you and us. Our failure
            to exercise or enforce any right or provision of these Terms and Conditions shall not
            operate as a waiver of such right or provision. These Terms and Conditions operate to
            the fullest extent permissible by law.
          </p>
          <p className="mt-3">
            If any provision or part of a provision of these Terms and Conditions is determined to
            be unlawful, void, or unenforceable, that provision or part of the provision is deemed
            severable from these Terms and Conditions and does not affect the validity and
            enforceability of any remaining provisions. There is no joint venture, partnership,
            employment or agency relationship created between you and us as a result of these
            Terms and Conditions or use of the Site.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Contact Us
          </h2>
          <p>
            To resolve a complaint or receive further information regarding use of the Site,
            please contact us at:
          </p>
          <address className="not-italic mt-4 space-y-1">
            <p className="font-bold">Snacqo</p>
            <p>NH-44 (GT Road), near Bahalgarh Chowk</p>
            <p>Sonipat, Haryana – 131021</p>
            <p>India</p>
            <p>
              Email:{' '}
              <a href="mailto:support@snacqo.com" className="text-primary hover:underline">
                support@snacqo.com
              </a>
            </p>
            <p>Phone: 8809515069</p>
          </address>
        </section>

      </div>
    </article>
  );
}
