<script lang="ts" setup>
import { getEnv } from '@tg/utils';

defineOptions({
  name: 'AppPoliciesTerms',
})
const { VITE_OFFICIAL_NAME } = getEnv()
</script>

<template>
  <div class="terms-conditions">
    <div class="terms-conditions-theme">
      Terms and Conditions
    </div>
    <div class="terms-conditions-title">
      1. Introduction
    </div>
    <div class="terms-conditions-describe">
      <p>
        1.1 These terms, conditions, and the documents mentioned below ("Terms"), apply to the use of
        <a class="link-inline">
          <span>{{ VITE_OFFICIAL_NAME }}</span>
        </a> ("Website") and its related or connected services (collectively referred to as the "Services").
      </p>
      <p>
        1.2 You should read these terms carefully because they contain important information about your rights and
        obligations when using this website. They form a legally binding agreement between you (our customer) and us. If
        you use this website and/or access the services, you (whether as a visitor or a registered account holder) agree
        to be bound by these terms and any revisions that may be added from time to time. If you do not accept these
        terms, please do not access the service or use the website.
      </p>
      <p>
        1.3 Besides these terms, our Privacy Policy also applies to your use of the website and services. Please make
        sure to read it before using them.
      </p>
      <p>
        1.4 When using our services, you must also follow additional rules, such as our "Responsible Gambling Policy"
        and "KYC Policy," which we may update from time to time. These policies are part of our terms and must be
        followed.
      </p>
    </div>

    <div class="terms-conditions-title">
      2. General Terms
    </div>
    <div class="terms-conditions-describe">
      <p>
        2.1 We reserve the right to modify or update these terms (including any referenced and linked documents) at any
        time. You should regularly check this page for updates. Once the updates are posted on the website, they take
        effect immediately and apply to all users. If you don't agree with the changes, you should stop using our
        services right away. By continuing to use the website after an update, you're agreeing to the new terms. Any
        bets placed before the changes take effect will still follow the previous terms.
      </p>
    </div>

    <div class="terms-conditions-title">
      3. Your Obligations
    </div>
    <div class="terms-conditions-describe">
      <p>
        3.1 By accessing our website and using our services, you confirm that:
      </p>
      <p>
        3.1.1 You are at least 18 years old or have reached the legal age for gambling in your jurisdiction. We reserve
        the right to request proof of age at any time.
      </p>
      <p>
        3.1.2 You have full legal capacity to enter into a binding agreement with us. If you do not, you must not access
        the website or use our services.
      </p>
      <p>
        3.1.3 You live in a place where gambling is legal and are not in a country that bans online gambling for its
        citizens or anyone within its borders. It is your responsibility to make sure you follow all applicable laws
        when using our services.
      </p>
      <p>
        3.1.4 You must not use VPNs, proxies, or similar tools to hide or manipulate your true location.
      </p>
      <p>
        3.1.5 You are the authorized user of the payment method used for transactions.
      </p>
      <p>
        3.1.6 All payments you make to us must be in good faith, and you must not try to reverse any transactions or
        take actions that could result in chargebacks from third parties.
      </p>
      <p>
        3.1.7 You understand that betting carries a risk of losing some or all of the funds deposited into your account,
        and you accept full responsibility for any losses.
      </p>
      <p>
        3.1.8 When placing bets, you must not use any information acquired illegally under the laws of your country of
        residence.
      </p>
      <p>
        3.1.9 You are acting solely on your own behalf as an individual, not on behalf of any third party or for any
        commercial purpose.
      </p>
      <p>
        3.1.10 You must not attempt to manipulate any markets or elements of our services in bad faith or take actions
        that could harm our services or integrity.
      </p>
      <p>
        3.1.11 You must act with integrity when using our services and placing bets.
      </p>
      <p>
        3.1.12 Neither you, nor any of your employees, employers, agents, or family members (if applicable), are
        registered as an affiliate in our affiliate program.
      </p>
    </div>

    <div class="terms-conditions-title">
      4. Restricted Use
    </div>
    <div class="terms-conditions-describe">
      <p>
        4.1 You are not allowed to use our services if:
      </p>
      <p>
        4.1.1 You are under 18 years old (or below the legal age of adulthood in your jurisdiction), or you are legally
        incapable of entering into a binding agreement with us, or you are acting on behalf of someone under 18 (or
        below the legal age in your jurisdiction).
      </p>
      <p>
        4.1.2 You reside in a country where online gambling is prohibited for residents or individuals within its
        territory.
      </p>
      <p>
        4.1.3 You are a resident of, or accessing the website from, any of the following countries: Austria, France and
        its territories, Germany, the Netherlands and its territories, Spain, Comoros, the United Kingdom, the United
        States and its territories, all countries on the FATF blacklist, and any other jurisdictions deemed prohibited
        by the Anjouan Offshore Finance Authority.
      </p>
      <p>
        4.1.4 You attempt to collect other customers' usernames, email addresses, and/or other personal information by
        any means (e.g., sending spam, unsolicited emails, or unauthorized data collection or linking to our services).
      </p>
      <p>
        4.1.5 You disrupt or interfere with other customers' activities or the normal operation of our services.
      </p>
      <p>
        4.1.6 You promote unsolicited commercial advertisements, affiliate links, or any other form of solicitation,
        which may be removed from our services without notice.
      </p>
      <p>
        4.1.7 You engage in any activity that we reasonably consider to be an attempt to: (i) defraud the service or
        other users, or (ii) collude with other users to gain an unfair advantage.
      </p>
      <p>
        4.1.8 You steal our betting odds or infringe on any of our intellectual property rights.
      </p>
      <p>
        4.1.9 You participate in any illegal activities.
      </p>
      <p>
        4.2 You may not sell, transfer, or acquire player accounts from third parties.
      </p>
      <p>
        4.3 You may not transfer funds between player accounts in any way.
      </p>
      <p>
        4.4 If you use our services for unauthorized purposes, we may terminate your account immediately by written
        notice. In some cases, legal action may also be taken against you.
      </p>
      <p>
        4.5 Without prior approval from the company's directors or CEO, employees of the company, as well as its agents,
        distributors, wholesalers, subsidiaries, advertising, promotional or media partners, contractors, retailers, and
        their immediate family members, are prohibited from depositing funds or using our services. If such activity is
        detected, the account will be terminated immediately, and all bonuses will be forfeited.
      </p>
    </div>

    <div class="terms-conditions-title">
      5. Registration
    </div>
    <div class="terms-conditions-describe">
      <p>
        5.1 By using the Services, you agree to:
      </p>
      <p>
        5.1.1 We reserve the right to decline any registration request at our sole discretion, without the obligation to
        provide a specific reason.
      </p>
      <p>
        5.1.2 Before using our services, you must personally complete the registration process and agree to these terms.
        To place bets or withdraw winnings, you may need to complete a verification process, which could involve
        providing valid identification and other necessary documents. These may include, but are not limited to: a copy
        of a photo ID (passport, driver's license, or national ID card) and a recent utility bill that displays your
        name and address as proof of residence. We reserve the right to suspend betting or restrict certain account
        features until the requested information is received. This verification process complies with applicable gaming
        regulations and anti-money laundering laws. Additionally, you must fund your account using one of the approved
        payment methods listed on our website.
      </p>
      <p>
        5.1.3 You must provide accurate contact information, including a valid email address, and update it as needed to
        ensure its accuracy. It is your responsibility to keep your contact details up to date; otherwise, you may miss
        important notifications and updates, including changes to these Terms. We use your registered email address to
        identify and communicate with you. You must maintain an active and unique email address and notify us of any
        changes. Additionally, you must secure your registered email account to prevent unauthorized access. We are not
        responsible for any loss or damage resulting from communications sent to your registered email. If we are unable
        to reach you due to an invalid email address, your account may be suspended until you update your information.
        If you intentionally provide false or inaccurate personal information, we may suspend your account immediately
        after notifying you in writing. In some cases, we may take legal action and/or report the matter to relevant
        authorities, who may also take action.
      </p>
      <p>
        5.1.4 You are allowed to register only one account on our services. If we find that you have multiple accounts,
        they will be closed immediately. This includes accounts created under another person's identity, such as
        relatives, partners, affiliates, associates, or any third party acting on your behalf.
      </p>
      <p>
        5.1.5 To verify your identity and assess your financial status, we may request additional personal information,
        such as your full name, or use third-party verification services as necessary. If we obtain any personal data
        from third-party sources, we will inform you of the data collected.
      </p>
      <p>
        5.1.6 You are responsible for keeping your account password confidential. If the correct account credentials are
        provided, we will assume that all bets, deposits, and withdrawals were made by you. To enhance security, we
        strongly recommend that you change your password regularly and never share your password with anyone. If you
        fail to protect your password, you will bear all associated risks and costs. You should log out of the services
        after each session. If you suspect that your account information has been compromised, hacked, or that your
        password has been exposed to a third party, you must notify us immediately. If your registered email has been
        hacked, you must report it to us, and we may require additional verification to confirm your identity. Once we
        become aware of such incidents, we will suspend your account immediately. During this time, you will be
        responsible for all activities carried out on your account, including unauthorized actions taken by third
        parties.
      </p>
      <p>
        5.1.7 You are not allowed to share any content or information from our services with other customers or any
        third parties through screenshots (or similar methods). Additionally, you may not display such information in a
        way that differs from how it appears when a customer or third party enters the service URL in their browser.
      </p>
      <p>
        5.1.8 When registering, you will have access to all available currencies listed on our website. These currencies
        will be used for deposits, withdrawals, and bets within the services as outlined in these Terms. However, some
        payment methods may not support all currencies.
      </p>
      <p>
        5.1.9 We are under no obligation to open an account for you. The registration page on our website serves only as
        an invitation for you to apply.
      </p>
      <p>
        5.1.10 Upon receiving your application, we may contact you to request additional information and/or documents to
        ensure compliance with regulatory and legal requirements.
      </p>
    </div>

    <div class="terms-conditions-title">
      6. Your Account
    </div>
    <div class="terms-conditions-describe">
      <p>
        6.1 Accounts can support multiple currencies. In such cases, all balances and transactions will be displayed in
        the currency used for each transaction.
      </p>
      <p>
        6.2 We do not offer credit for the use of our services.
      </p>
      <p>
        6.3 If you fail to comply with these terms, or if we have reason to believe you are not in compliance, we may
        close or suspend your account to maintain the integrity and fairness of our services or for any other reasonable
        cause. In some cases, we may not be able to provide prior notice. If your account is closed or suspended due to
        a violation, we may cancel and/or void any bets and withhold any funds in your account, including deposits.
      </p>
      <p>
        6.4 We reserve the right to close or suspend any account and refund all funds without prior notice. However, any
        outstanding contractual obligations will be honored.
      </p>
      <p>
        6.5 We reserve the right to refuse, restrict, cancel, or limit any bets at any time for any reason, including
        but not limited to bets placed fraudulently or in an attempt to bypass our betting limits or system regulations.
      </p>
      <p>
        6.6 If any funds are mistakenly credited to your account, they remain our property. Once we become aware of the
        error, we will notify you, and the amount will be deducted from your account.
      </p>
      <p>
        6.7 If your account becomes overdrawn for any reason, you are responsible for repaying the overdrawn amount.
      </p>
      <p>
        6.8 If you notice any errors in your account, you must notify us immediately.
      </p>
      <p>
        6.9 Betting should be for entertainment and leisure purposes only. If gambling stops being enjoyable, you should
        stop. Never bet more than you can afford to lose. If you feel you are losing control, we offer a self-exclusion
        option. During self-exclusion, your account will be restricted from deposits, gameplay, and other functions
        until you choose to lift the restriction.
      </p>
      <p>
        6.10 You are not allowed to transfer, sell, or pledge your account to anyone else. This restriction applies to
        any form of valuable asset, including but not limited to account ownership, bonuses, deposits, bets, and any
        associated rights or claims, whether legal, commercial, or otherwise. Prohibited transfers also include
        pledging, mortgaging, assigning, trading, brokering, or gifting your account in collaboration with trustees,
        third parties, corporations, individuals, foundations, or associations.
      </p>
      <p>
        6.11 If you wish to close your account, please email our customer support team from your registered email
        address using the link available on our website.
      </p>
    </div>

    <div class="terms-conditions-title">
      7. Funds Deposit
    </div>
    <div class="terms-conditions-describe">
      <p>
        7.1 All deposits must be made using an account, payment system, or credit card registered in your name. Deposits
        made in currencies not supported by our platform will be converted at the prevailing exchange rate of our
        payment processor before being credited to your account. Please note that some payment systems may charge
        additional currency conversion fees, which will be deducted from your total deposit amount.
      </p>
      <p>
        7.2 Fees and charges may apply to customer deposits and withdrawals. Details can be found on our website. In
        most cases, we cover the transaction fees for deposits into your account.
      </p>
      <p>
        7.3 We are not a financial institution and rely on third-party electronic payment processors for handling credit
        and debit card deposits. We do not process these deposits directly. If you deposit using a credit or debit card,
        your account will only be credited once we receive approval and an authorization code from the issuing financial
        institution. If your card issuer does not grant authorization, your deposit will not be credited.
      </p>
      <p>
        7.4 By using our services, you agree to fully pay any amounts due to us or the payment provider. You further
        agree not to request refunds, chargebacks, cancellations, or otherwise revoke any deposits. If you attempt to do
        so, you will be required to reimburse us for the unpaid deposits, including any fees incurred in processing your
        transactions. Additionally, any winnings resulting from bets placed using these refunded funds will be
        forfeited. Your player account is not a bank account and is not insured, guaranteed, or protected by any deposit
        or banking insurance system. No interest is earned on funds held in your player account.
      </p>
      <p>
        7.5 Funds obtained from criminal, illegal, or unauthorized activities may not be deposited with us.
      </p>
      <p>
        7.6 If you make a deposit using a credit card, we recommend keeping a record of your transactions and a copy of
        these Terms.
      </p>
      <p>
        7.7 Online gambling may be illegal in your jurisdiction. If so, you are not permitted to use your payment card
        to deposit funds on this website. It is your responsibility to be aware of and comply with the online gambling
        laws in your country or region.
      </p>
    </div>

    <div class="terms-conditions-title">
      8. Withdrawals
    </div>
    <div class="terms-conditions-describe">
      <p>
        8.1 You can request a withdrawal at any time, as long as it complies with our withdrawal terms, to cash out any
        available and settled funds from your account.
      </p>
      <p>
        8.2 Before processing your withdrawal, we may ask for a valid photo ID, proof of address, or other verification
        steps (such as a selfie or a verification call) to confirm your identity. We also reserve the right to verify
        your identity at any point during your time with us.
      </p>
      <p>
        8.3 Withdrawals must be processed through the same payment method you originally used to deposit funds---whether
        it's a debit card, credit card, bank account, or another payment option. In some cases, we may allow withdrawals
        through a different method, but this will be subject to additional security checks.
      </p>
      <p>
        8.4 If you are unable to access your account due to inactivity, a lock, or closure, and you need to withdraw
        funds, please reach out to our customer support team for assistance.
      </p>
      <p>
        8.5 Please note that if you violate the restricted usage policies stated in Sections 3.3 and 4, we cannot
        guarantee that your withdrawal or any refunds will be processed successfully.
      </p>
    </div>

    <div class="terms-conditions-title">
      9. Payment Transactions
    </div>
    <div class="terms-conditions-describe">
      <p>
        9.1 You are fully responsible for any payments owed to us. You must not attempt to reverse a completed payment
        or take actions that could cause a third party to revoke the transaction in order to avoid your obligations. If
        you do, you will be required to compensate us for any chargebacks, cancellations, or reversals, along with any
        costs or losses we incur as a result.
      </p>
      <p>
        9.2 We may use third-party payment providers or banks to process transactions. By making payments through our
        platform, you agree to follow their terms and conditions, as long as they have been disclosed to you and do not
        conflict with these Terms.
      </p>
      <p>
        9.3 To prevent fraud, money laundering, or other illegal activities, all transactions on our website may be
        reviewed. Any suspicious activity will be reported to the relevant authorities.
      </p>
      <p>
        9.4 When it comes to the funds in your account, our affiliated companies, agents, partners, and service
        providers (where applicable) are considered part of our corporate group and may be involved in handling your
        transactions.
      </p>
    </div>

    <div class="terms-conditions-title">
      10. Errors
    </div>
    <div class="terms-conditions-describe">
      <p>
        10.1 If there is an error or malfunction in our system or processes, all bets will be void. You are obligated to
        notify us immediately upon discovering any errors in the service. If a communication or system error, glitch, or
        bug results in a defect in the service and/or an incorrect payout to you, we will not be liable for any direct
        or indirect costs, expenses, losses, or claims incurred by you or any third party due to such errors. We reserve
        the right to cancel all affected games/bets and take any necessary corrective actions.
      </p>
      <p>
        10.2 We strive to publish bookmaker odds accurately. However, if a bet is accepted at incorrect odds due to
        human error or a system issue, and those odds: significantly differ from the general market odds at the time of
        the bet, or are clearly incorrect based on the actual probability of the event occurring, we reserve the right
        to cancel or void the bet, including any bets placed after an event has started.
      </p>
      <p>
        10.3 If you receive an overpayment due to an error, we have the right to reclaim the excess amount and adjust
        your account balance accordingly. Errors may include incorrect pricing or wrongly recorded event results. If
        your balance is insufficient, you may be required to cover any outstanding amount. We also reserve the right to
        cancel, adjust, or remove any pending bets that involve funds obtained from an error.
      </p>
    </div>

    <div class="terms-conditions-title">
      11. Game Rules, Refunds, and Cancellations
    </div>
    <div class="terms-conditions-describe">
      <p>
        11.1 The winner of an event is determined on the event's settlement date, and we will not acknowledge protests
        or overturned decisions for betting purposes.
      </p>
      <p>
        11.2 Once a result is published, it becomes final after 72 hours. No disputes will be accepted beyond this
        period, except in cases of human error, system errors, or incorrect result references.
      </p>
      <p>
        11.3 If a competition's governing body overturns a result within the payout period, all winnings will be
        refunded.
      </p>
      <p>
        11.4 If an event offers a draw option, bets placed on either team to win will be considered lost if the event
        ends in a draw. If no draw option is available, all bets will be refunded in the case of a draw. If extra time
        is played, it will be included in the settlement unless a draw option was available.
      </p>
      <p>
        11.5 If we cannot verify an event's result---for example, due to a disrupted live broadcast and lack of
        alternative sources---we reserve the right to void all bets on that event and issue refunds.
      </p>
      <p>
        11.6 The minimum and maximum bet amounts for each event are determined at our discretion and may change without
        prior written notice. We also reserve the right to adjust individual account limits.
      </p>
      <p>
        11.7 Customers are fully responsible for their transactions. Once a bet is placed, it cannot be modified. We do
        not accept responsibility for lost or duplicate bets and do not process claims related to such issues. To ensure
        all bets have been placed correctly, customers should review their transaction history in the "My Account"
        section after each session.
      </p>
      <p>
        11.8 As long as the two teams are correctly listed, the match will be valid regardless of the league name under
        which it appears on our website.
      </p>
      <p>
        11.9 The start times for esports events displayed on our website are for reference only and are not guaranteed
        to be accurate. If an event is postponed or suspended and does not resume within 72 hours of its originally
        scheduled start time, it will be void and bets will be refunded. However, bets placed on team/player advancement
        or tournament winners will stand, even if the event is postponed.
      </p>
      <p>
        11.10 If we publish an incorrect event date, all bets will be settled based on the date provided by the
        governing body.
      </p>
      <p>
        11.11 If a team uses substitutes, the result remains valid, as this is the team's decision.
      </p>
      <p>
        11.12 We reserve the right to remove events, markets, and any other products from the website.
      </p>
    </div>

    <div class="terms-conditions-title">
      12. Communications and Notifications
    </div>
    <div class="terms-conditions-describe">
      <p>
        12.1 If you need to contact us regarding these terms, all communications and notices must be submitted through
        the customer support form available on our website.
      </p>
      <p>
        12.2 Unless otherwise stated in these terms, we will communicate with you through notifications on our website
        and/or by sending messages to the email address registered on your account. The method of communication will be
        chosen at our discretion.
      </p>
      <p>
        12.3 All communication between you and us must be in written English and sent via the email address associated
        with your account.
      </p>
      <p>
        12.4 Occasionally, we may send you emails with betting updates, exclusive promotions, and other relevant news
        about our platform. By agreeing to these terms during registration, you consent to receiving such
        communications. You can opt out of promotional emails anytime by contacting customer support.
      </p>
    </div>

    <div class="terms-conditions-title">
      13. Matters Beyond Our Control
    </div>
    <div class="terms-conditions-describe">
      <p>
        13.1 While we take all reasonable precautions to ensure uninterrupted service, we are not responsible for any
        failures or delays caused by events beyond our control (*force majeure*). These events include, but are not
        limited to: natural disasters; trade or labor disputes; power outages, any actions, failures or negligence of
        governments or authorities; disruptions or failures in telecommunications services; any other delays or failures
        caused by third parties. We are not liable for any losses or damages you may suffer due to such events. In these
        cases, we reserve the right to cancel or suspend our services without liability.
      </p>
    </div>

    <div class="terms-conditions-title">
      14. Liability
    </div>
    <div class="terms-conditions-describe">
      <p>
        14.1 To the fullest extent permitted by law, we are not responsible for any foreseeable or unforeseen losses you
        may experience while using our services, unless such losses result from our direct legal obligations (e.g.,
        liability for death or personal injury caused by our negligence). We are not responsible for losses caused by:
        (I) Your own actions or negligence; (II) Third parties unrelated to our fulfillment of these terms (e.g., issues
        caused by network performance, congestion, or connectivity, or problems with your computer equipment); or (III)
        Any other event that we or our suppliers could not have reasonably foreseen or prevented even with due care.
      </p>
      <p>
        14.2 Since our services are intended for personal use only, we accept no liability for any business-related
        losses.
      </p>
      <p>
        14.3 If we are found liable for any reason, our total liability to you will be limited to (A) the value of the
        bet(s) or wagers placed through your account that are directly related to the claim.
      </p>
      <p>
        14.4 We strongly recommend that you (I) check that your computer or device is compatible with our services
        before using them, and (II) take appropriate security measures, such as using up-to-date antivirus software, to
        protect yourself from harmful programs or cyber threats.
      </p>
    </div>

    <div class="terms-conditions-title">
      15. Underage Gambling
    </div>
    <div class="terms-conditions-describe">
      <p>
        15.1 If we suspect that you are under 18 (or below the legal age in your jurisdiction) or receive evidence that
        you placed bets while underage, we will suspend (lock) your account to prevent further betting or withdrawals.
        We will then investigate whether you: (a) are currently underage; (b) were underage when placing bets; or (c)
        placed bets on behalf of someone underage. If we determine that you meet any of these conditions:
      </p>
      <p>
        15.1.1 All bonuses in your account will be forfeited.
      </p>
      <p>
        15.1.2 Any winnings obtained while underage must be returned to us. If you fail to comply, we may take legal
        action to recover the funds.
      </p>
      <p>
        15.1.3 Any deposits (excluding bonuses) may be refunded at our discretion. We reserve the right to deduct
        transaction fees before issuing a refund.
      </p>
      <p>
        15.2 If you are 18 or older but place bets in a jurisdiction where the legal betting age is higher than 18 and
        you are below that jurisdiction's minimum legal age, these conditions will also apply to you.
      </p>
      <p>
        15.3 If we suspect fraudulent activity or an attempt to exploit these terms, we reserve the right to conduct a
        thorough investigation and report the matter to law enforcement authorities.
      </p>
    </div>

    <div class="terms-conditions-title">
      16. Fraud
    </div>
    <div class="terms-conditions-describe">
      <p>
        16.1 We take fraud seriously and will pursue criminal and contractual penalties against any customer involved in
        fraud, dishonesty, or illegal activity. If we suspect such behavior, we will refuse to pay out any winnings.
        Customers are responsible for reimbursing us for any costs, fees, or losses (including direct, indirect, and
        consequential damages, loss of profits, business, and reputation) caused directly or indirectly by their
        fraudulent, dishonest, or criminal conduct.
      </p>
    </div>

    <div class="terms-conditions-title">
      17. Intellectual Property
    </div>
    <div class="terms-conditions-describe">
      <p>
        17.1 Any unauthorized use of our name, logo, or branding may result in legal action.
      </p>
      <p>
        17.2 We are the sole owner of the service, including our technology, software, and business systems
        (collectively referred to as the "System"), as well as our betting odds. You may not use your personal account
        for commercial purposes (e.g., selling your status updates to advertisers). If your account nickname is
        inappropriate or misleading, we reserve the right to remove or reclaim it at our discretion.
      </p>
      <p>
        17.3 You may not use our URLs, trademarks, trade names, logos ("Trademarks"), or betting odds for any products
        or services not associated with us, in any way that may cause confusion among customers or the public, or in any
        manner that disparages us.
      </p>
      <p>
        17.4 Except as explicitly stated in these terms, we and our licensors do not grant you any rights, licenses, or
        ownership over the System or our trademarks. Any unauthorized use, reproduction, or copying of our content may
        result in legal action.
      </p>
    </div>

    <div class="terms-conditions-title">
      18. Your License
    </div>
    <div class="terms-conditions-describe">
      <p>
        18.1 Subject to these terms and your compliance with them, we grant you a non-exclusive, limited,
        non-transferable, and non-sublicensable license to access and use our service for personal, non-commercial
        purposes only. This license automatically terminates if our agreement with you under these terms ends.
      </p>
      <p>
        18.2 Except for content that you legally own, you may not modify, publish, transmit, transfer, sell, copy,
        upload, post, distribute, perform, display, create derivative works from, or otherwise exploit any part of the
        service, its content, or its software, unless explicitly permitted by these terms or through authorization on
        our website. You are also prohibited from: altering, merging, or republishing any information or content from
        the service; engaging in activities such as screen scraping, database scraping, or any other method intended to
        collect, store, reorganize, or manipulate our data.
      </p>
      <p>
        18.3 Failure to comply with these terms may constitute an infringement of intellectual property or proprietary
        rights, potentially leading to civil liability and/or criminal prosecution.
      </p>
    </div>

    <div class="terms-conditions-title">
      19. Your Conduct and Security
    </div>
    <div class="terms-conditions-describe">
      <p>
        19.1 To maintain a safe and fair environment for all customers, illegal, inappropriate, or harmful content or
        behavior (referred to as "Prohibited Conduct") is strictly forbidden on our platform.
      </p>
      <p>
        19.2 If we determine, at our sole discretion, that you have engaged in Prohibited Conduct, we may immediately
        terminate your account and/or restrict your access to the service without prior notice. Additionally, legal
        action may be taken against you by other customers, third parties, law enforcement agencies, or us.
      </p>
      <p>
        19.3 Prohibited Conduct includes, but is not limited to: promoting or sharing false, misleading, or illegal
        information; engaging in unlawful activities, including facilitating or promoting criminal acts, violating
        others' privacy, or distributing computer viruses; harming minors in any way; transmit or provide content that
        is illegal, harmful, threatening, abusive, deceptive, defamatory, vulgar, obscene, indecent, violent, hateful,
        racially or ethnically offensive, or otherwise objectionable; sharing content you do not have the legal right to
        distribute, including copyrighted, trademarked, or proprietary content owned by third parties; transmitting
        software viruses, harmful code, or HTML scripts intended to disrupt, interfere with, or alter the functionality
        of the service, other websites, or any software/hardware; interfere with, disrupt, or attempt to
        reverse-engineer the service, including but not limited to intercepting, emulating, or redirecting communication
        protocols we use, creating or using cheats, mods, hacks, or any software intended to modify the service, or
        using software to intercept or collect information from or through the service; using bots, spiders, or
        automated mechanisms to retrieve or index information from our platform; deceiving or defrauding other customers
        in any way; sending unsolicited or unauthorized advertisements or bulk messages, such as spam, instant messages,
        junk mail, chain letters, pyramid schemes, or other solicitations; creating accounts using automated or
        fraudulent methods; impersonating other customers or third parties or engaging in behavior that contradicts our
        business principles. The above list of Prohibited Conduct is not exhaustive, and we may update it at any time.
        We reserve the right to investigate and take any action we deem appropriate or necessary, including but not
        limited to removing customer posts from the service, terminating accounts, and taking legal action against any
        customer or third party who directly or indirectly enables Prohibited Conduct, with or without notice.
      </p>
    </div>

    <div class="terms-conditions-title">
      20. Links to Other Websites
    </div>
    <div class="terms-conditions-describe">
      <p>
        20.1 Our services may contain links to third-party websites that are neither owned, maintained, nor affiliated
        with us. These links are provided solely for your convenience. We do not investigate, monitor, or verify the
        accuracy, reliability, or completeness of any third-party websites. The inclusion of such links does not imply
        our endorsement of the linked websites, their content, or their owners, nor any affiliation between us and the
        third party. We are not responsible for the availability, security, accuracy, or reliability of third-party
        websites. We strongly recommend that you review their privacy policies and terms of use before interacting with
        them.
      </p>
    </div>

    <div class="terms-conditions-title">
      21. Complaints
    </div>
    <div class="terms-conditions-describe">
      <p>
        21.1 If you have concerns or complaints regarding these Terms, please contact our customer service department
        through the link provided on our website. All communications must be sent from your registered email address.
      </p>
      <p>
        21.2 Despite the above, we are not liable to you or any third party for responding to any complaints or taking
        any actions in response.
      </p>
      <p>
        21.3 If a customer is dissatisfied with how a bet has been settled, they should submit details of their
        complaint to our customer service department. We will make reasonable efforts to address such concerns promptly
        and aim to respond within 28 days of receiving the complaint.
      </p>
      <p>
        21.4 Disputes must be raised within three (3) days from the date the relevant bet was settled. Claims submitted
        after this period will not be accepted. Customers are fully responsible for reviewing their account transactions
        and raising disputes in a timely manner.
      </p>
      <p>
        21.5 If a dispute arises, our customer service team will attempt to reach a mutually agreeable resolution. If no
        agreement is reached, the matter will be escalated to our management team for further review.
      </p>
      <p>
        21.6 If all efforts to resolve the dispute fail, the customer has the right to seek resolution through
        arbitration.
      </p>
    </div>

    <div class="terms-conditions-title">
      22. Assignment
    </div>
    <div class="terms-conditions-describe">
      <p>
        22.1 You may not assign, transfer, or delegate any of your rights or obligations under these Terms without our
        prior written consent, which we will not unreasonably withhold. We may assign all or part of our rights and
        obligations under these Terms to any third party without your consent, provided that the third party can provide
        a service of essentially the same quality by posting written notice on the services.
      </p>
    </div>

    <div class="terms-conditions-title">
      23. Severability
    </div>
    <div class="terms-conditions-describe">
      <p>
        23.1 If any provision of these Terms is found to be unenforceable or invalid by a competent authority, that
        provision will be modified to the extent necessary to make it enforceable to the maximum extent permitted by
        law. The validity and enforceability of the remaining provisions of these Terms will not be affected.
      </p>
    </div>

    <div class="terms-conditions-title">
      24. Violation of These Terms
    </div>
    <div class="terms-conditions-describe">
      <p>
        24.1 As a user, you agree to fully indemnify, defend, and protect the company, its affiliates, third-party
        service providers, and licensors, as well as their respective officers, directors, and employees from all
        claims, damages, losses, costs, and legal fees that arise due to: (a) Your violation of these Terms; (b) Your
        violation of any law or third-party rights; (c) Any use of our services or software by you or anyone else using
        your login credentials, whether with or without your permission; (d) Your acceptance of any bonuses.
      </p>
      <p>
        24.2 If you breach these terms, or if we have reason to suspect you have, we reserve the right to confiscate any
        bonuses you have received, publicly disclose your real name if necessary, withhold funds from your account to
        cover damages or any amounts owed to us, until investigations or legal proceedings are completed.
      </p>
    </div>

    <div class="terms-conditions-title">
      25. General Provisions
    </div>
    <div class="terms-conditions-describe">
      <p>
        25.1 Term of Agreement. These Terms remain in effect as long as you use our services or are a customer of our
        platform. Even if your account is terminated, certain provisions will still apply.
      </p>
      <p>
        25.2 Gender. Words in singular form include the plural and vice versa. Words referring to one gender apply to
        all genders. References to a person include individuals, businesses, organizations, and corporations.
      </p>
      <p>
        25.3 Waiver. If we choose not to enforce any part of these Terms at a given time, it does not mean we are
        waiving our right to do so in the future. Any waiver must be formally written and signed to be valid.
      </p>
      <p>
        25.4 Acknowledgment. By accessing or using the services, you confirm that you have read, understood, and agreed
        to these Terms. You also waive any future claims that contradict what is stated here.
      </p>
      <p>
        25.5 Language. If there are any differences between the English version of these terms and translations in other
        languages, the English version will always take precedence.
      </p>
      <p>
        25.6 Entire Agreement. These terms represent the full agreement between you and the company regarding our
        services, overriding any previous agreements, whether written or verbal.
      </p>
      <p>
        25.7 Class Action Waiver. You waive the right to participate in any class action lawsuit, arbitration, or
        collective legal action against the company related to these terms or our services.
      </p>
    </div>
  </div>
</template>

<style>
:root {
  --app-terms-theme-size: var(--tg-font-size-base);
  --app-terms-title-size: var(--tg-font-size-base);
  --app-terms-desc-size: var(--tg-font-size-default);
}
</style>

<style lang="scss" scoped>
.terms-conditions {
  max-height: 100%;
  text-align: left;
  border-radius: var(--tg-radius-default);
  transition: all 0.5s;

  .theme {
    margin: var(--tg-spacing-12) 0;
  }

  .terms-conditions-theme {
    color: var(--tg-text-white);
    font-size: var(--app-terms-theme-size);
    font-weight: var(--tg-font-weight-semibold);
    @include webTheme('white'){
      color: #111;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }

  .terms-conditions-title {
    color: var(--tg-text-white);
    font-size: var(--app-terms-title-size);
    font-weight: var(--tg-font-weight-semibold);
    margin: var(--tg-spacing-32) 0 var(--tg-spacing-8);
    line-height: 24px;
    @include webTheme('white'){
      color: #111;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 22px; /* 157.143% */
    }
  }

  .terms-conditions-describe {
    color: var(--tg-text-lightgrey);
    font-size: var(--app-terms-desc-size);
    font-weight: 400;
    line-height: 21px;
    @include webTheme('green') {
      color: #3CB389;
    }
    @include webTheme('white'){
      color: #555;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    > p + p {
      margin-top: var(--tg-spacing-12);
    }
  }
}
</style>
