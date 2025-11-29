<script setup lang='ts'>
import { IconUniArrowleftLine } from '@tg/icons'

defineOptions({
  name: 'AppRegister',
})
const closeDialog = inject('closeDialog', () => { })

const { openNotify } = useNotify()
const appStore = useAppStore()
const { t } = useI18n()
const { openLoginDialog } = useLoginDialog()
// const { openTermsConditionsDialog } = useTermsConditionsDialog()
const steps = ref(2)
const registerFormRef = ref()
const { VITE_OFFICIAL_NAME } = getEnv()

async function getMemberReg() {
  registerFormRef.value.getMemberReg(() => {
    // closeDialog()
    // nextTick(() => {
    //   openTermsConditionsDialog()
    // })
  })
}

async function toLogin() {
  closeDialog()
  await nextTick()
  openLoginDialog()
}
</script>

<template>
  <Suspense timeout="0">
    <div class="app-register">
      <template v-if="steps === 1">
        <div class="app-register-title">
          {{ t('pop_up_create_account_label_reg_step1') }}
        </div>
        <AppRegisterForm ref="registerFormRef" is-register />
      </template>
      <template v-else>
        <div class="app-register-terms-conditions">
          <div class="title">
            <BaseButton
              type="text" size="none" style="--tg-base-button-font-size:20px;"
              @click="steps = 1"
            >
              <IconUniArrowleftLine />
            </BaseButton>
            <span>{{ t('terms_conditions') }}</span>
          </div>
          <div class="scroll-y terms-conditions">
            <div>
              <div class="terms-conditions-theme">
                Terms and Conditions
              </div>
              <div class="terms-conditions-title">
                1.{{ VITE_OFFICIAL_NAME }}.COM
              </div>
              <div class="terms-conditions-describe">
                1.1 {{ VITE_OFFICIAL_NAME }}.com is owned and operated by Medium Rare,
                N.V. (hereinafter "{{ VITE_OFFICIAL_NAME }}",
                "We" or "Us"), a company with head office
                at Korporaalweg 10, Willemstad, Curaçao.
                {{ VITE_OFFICIAL_NAME }} is licensed and regulated by
                the Government of Curaçao under the gaming license 8048/JAZ
                issued to Antillephone. Some credit card payment processing
                are handled by its wholly owned subsidiary, Medium Rare Limited.
              </div>

              <div class="terms-conditions-title">
                2. IMPORTANT NOTICE
              </div>
              <div class="terms-conditions-describe">
                2.1 BY REGISTERING ON WWW.XXX.COM
                (THE “WEBSITE”), YOU ENTER INTO A CONTRACT WITH MEDIUM
                RARE N.V., AND AGREE TO BE BOUND BY (I) THESE TERMS AND
                CONDITIONS; (II) OUR PRIVACY POLICY; (III) OUR COOKIES
                POLICY AND (IV) THE RULES APPLICABLE TO OUR BETTING
                OR GAMING PRODUCTS AS FURTHER REFERENCED IN THESE TERMS
                AND CONDITIONS (“TERMS AND CONDITIONS” OR “AGREEMENT”)
                , AND THE BETTING AND/OR GAMING SPECIFIC RULES,
                AND ARE DEEMED TO HAVE ACCEPTED AND UNDERSTOOD ALL THE TERMS.
              </div>
              <div class="terms-conditions-describe">
                2.2 PLEASE READ THIS AGREEMENT CAREFULLY TO MAKE SURE
                YOU FULLY UNDERSTAND ITS CONTENT. IF YOU HAVE ANY DOUBTS
                AS TO YOUR RIGHTS AND OBLIGATIONS RESULTING FROM THE
                ACCEPTANCE OF THIS AGREEMENT, PLEASE CONSULT A LEGAL
                ADVISOR IN YOUR JURISDICTION BEFORE FURTHER USING THE
                WEBSITE(S) AND ACCESSING ITS CONTENT. IF YOU DO NOT
                ACCEPT THE TERMS, DO NOT USE, VISIT OR ACCESS ANY PART
                (INCLUDING, BUT NOT LIMITED TO, SUB-DOMAINS, SOURCE
                CODE AND/OR WEBSITE APIS, WHETHER VISIBLE OR NOT) OF THE WEBSITE.
              </div>

              <div class="terms-conditions-title">
                3. GENERAL
              </div>

              <div class="terms-conditions-title">
                2. IMPORTANT NOTICE
              </div>
              <div class="terms-conditions-describe">
                2.1 BY REGISTERING ON WWW.XXX.COM
                (THE “WEBSITE”), YOU ENTER INTO A CONTRACT WITH MEDIUM RARE N.V.,
                AND AGREE TO BE BOUND BY (I) THESE TERMS AND CONDITIONS; (II)
                OUR PRIVACY POLICY; (III) OUR COOKIES POLICY AND (IV) THE RULES
                APPLICABLE TO OUR BETTING OR GAMING PRODUCTS AS FURTHER
                REFERENCED IN THESE TERMS AND CONDITIONS (“TERMS AND CONDITIONS”
                OR “AGREEMENT”), AND THE BETTING AND/OR GAMING SPECIFIC RULES,
                AND ARE DEEMED TO HAVE ACCEPTED AND UNDERSTOOD ALL THE TERMS.
              </div>
              <div class="terms-conditions-describe">
                2.2 PLEASE READ THIS AGREEMENT CAREFULLY TO MAKE SURE YOU FULLY
                UNDERSTAND ITS CONTENT. IF YOU HAVE ANY DOUBTS AS TO YOUR RIGHTS
                AND OBLIGATIONS RESULTING FROM THE ACCEPTANCE OF THIS AGREEMENT,
                PLEASE CONSULT A LEGAL ADVISOR IN YOUR JURISDICTION BEFORE
                FURTHER USING THE WEBSITE(S) AND ACCESSING ITS CONTENT. IF
                YOU DO NOT ACCEPT THE TERMS, DO NOT USE, VISIT OR ACCESS
                ANY PART (INCLUDING, BUT NOT LIMITED TO, SUB-DOMAINS,
                SOURCE CODE AND/OR WEBSITE APIS, WHETHER VISIBLE OR NOT)
                OF THE WEBSITE.
              </div>
              <div class="terms-conditions-title">
                2. IMPORTANT NOTICE
              </div>
              <div class="terms-conditions-describe">
                2.1 BY REGISTERING ON WWW.XXX.COM
                (THE “WEBSITE”), YOU ENTER INTO A CONTRACT WITH MEDIUM RARE N.V.,
                AND AGREE TO BE BOUND BY (I) THESE TERMS AND CONDITIONS; (II)
                OUR PRIVACY POLICY; (III) OUR COOKIES POLICY AND (IV) THE RULES
                APPLICABLE TO OUR BETTING OR GAMING PRODUCTS AS FURTHER REFERENCED
                IN THESE TERMS AND CONDITIONS (“TERMS AND CONDITIONS” OR
                “AGREEMENT”), AND THE BETTING AND/OR GAMING SPECIFIC RULES,
                AND ARE DEEMED TO HAVE ACCEPTED AND UNDERSTOOD ALL THE TERMS.
              </div>
              <div class="terms-conditions-describe">
                2.2 PLEASE READ THIS AGREEMENT CAREFULLY TO MAKE SURE YOU FULLY
                UNDERSTAND ITS CONTENT. IF YOU HAVE ANY DOUBTS AS TO YOUR RIGHTS
                AND OBLIGATIONS RESULTING FROM THE ACCEPTANCE OF THIS AGREEMENT,
                PLEASE CONSULT A LEGAL ADVISOR IN YOUR JURISDICTION BEFORE FURTHER
                USING THE WEBSITE(S) AND ACCESSING ITS CONTENT. IF YOU DO NOT
                ACCEPT THE TERMS, DO NOT USE, VISIT OR ACCESS ANY PART (INCLUDING,
                BUT NOT LIMITED TO, SUB-DOMAINS, SOURCE CODE AND/OR WEBSITE APIS,
                WHETHER VISIBLE OR NOT) OF THE WEBSITE.
              </div>
              <div class="terms-conditions-title">
                2. IMPORTANT NOTICE
              </div>
              <div class="terms-conditions-describe">
                2.1 BY REGISTERING ON WWW.XXX.COM
                (THE “WEBSITE”), YOU ENTER INTO A CONTRACT WITH MEDIUM RARE N.V.,
                AND AGREE TO BE BOUND BY (I) THESE TERMS AND CONDITIONS; (II) OUR
                PRIVACY POLICY; (III) OUR COOKIES POLICY AND (IV) THE RULES
                APPLICABLE TO OUR BETTING OR GAMING PRODUCTS AS FURTHER REFERENCED
                IN THESE TERMS AND CONDITIONS (“TERMS AND CONDITIONS” OR
                “AGREEMENT”), AND THE BETTING AND/OR GAMING SPECIFIC RULES,
                AND ARE DEEMED TO HAVE ACCEPTED AND UNDERSTOOD ALL THE TERMS.
              </div>
              <div class="terms-conditions-describe">
                2.2 PLEASE READ THIS AGREEMENT CAREFULLY TO MAKE SURE YOU FULLY
                UNDERSTAND ITS CONTENT. IF YOU HAVE ANY DOUBTS AS TO YOUR RIGHTS
                AND OBLIGATIONS RESULTING FROM THE ACCEPTANCE OF THIS AGREEMENT,
                PLEASE CONSULT A LEGAL ADVISOR IN YOUR JURISDICTION BEFORE
                FURTHER USING THE WEBSITE(S) AND ACCESSING ITS CONTENT. IF
                YOU DO NOT ACCEPT THE TERMS, DO NOT USE, VISIT OR ACCESS
                ANY PART (INCLUDING, BUT NOT LIMITED TO, SUB-DOMAINS,
                SOURCE CODE AND/OR WEBSITE APIS, WHETHER VISIBLE OR NOT)
                OF THE WEBSITE.
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="app-bottom">
        <div class="app-bottom-text">
          <div>
            {{ t('have_account') }}
            <span class="text-tg-text-white text-bold" @click.stop="toLogin">{{ t('pop_up_create_an_account_bottom_button_login') }}</span>
          </div>
        </div>
      </div>
    </div>
    <template #fallback>
      <div class="register-height">
        <BaseLoading />
      </div>
    </template>
  </Suspense>
</template>

<style lang='scss' scoped>
.text-bold {
  font-weight: var(--tg-font-weight-semibold);
}
.register-height {
  padding: 100px 0;
}
.app-register {
  --tg-base-input-style-pad-x: 7px;
  --tg-spacing-input-padding-vertical: 7.25px;
  &-title {
    color: var(--tg-text-lightgrey);
    text-align: center;
    font-size: var(--tg-font-size-base);
    font-weight: var(--tg-font-weight-semibold);
    line-height: 24px;
    padding-bottom: var(--tg-spacing-16);
    padding-top: var(--tg-spacing-16);
  }

  &-input-box {
    display: flex;
    flex-direction: column;
    gap: var(--tg-spacing-16);
    .code-label{
      display: flex;
      justify-content: flex-start;
    }
    .code-input {
        margin-top: 4px;
    }
  }

  &-check-box {
    display: flex;
    flex-direction: column;
    gap: var(--tg-spacing-16);
    padding-top: 16px;

    .agree {
      display: flex;
      align-items: center;
    }
  }

  &-btn {
    width: 100%;
  }

  .app-register-btn {
    font-size: var(--tg-font-size-base);
  }
}

.app-register-terms-conditions {
  display: flex;
  flex-direction: column;
  gap: var(--tg-spacing-12);

  .title {
    margin-top: var(--tg-spacing-12);
    color: var(--tg-text-lightgrey);
    text-align: center;
    font-size: var(--tg-font-size-base);
    font-style: normal;
    font-weight: var(--tg-font-weight-semibold);
    line-height: normal;
    display: flex;
    align-items: center;

    span {
      display: inline-block;
      flex: 1;
      text-align: center;
    }

    .icon {
      display: flex;
      align-items: center;
    }
  }

  .terms-conditions {
    padding: var(--tg-spacing-20) var(--tg-spacing-12);
    text-align: left;
    border-radius: var(--tg-radius-default);
    background: var(--tg-secondary-main);
    transition: all 0.5s;

    .theme {
      margin: var(--tg-spacing-12) 0;
    }

    .terms-conditions-theme {
      color: var(--tg-text-white);
      font-size: var(--tg-font-size-md);
      font-weight: var(--tg-font-weight-semibold);
    }

    .terms-conditions-title {
      color: var(--tg-text-white);
      font-size: var(--tg-font-size-md);
      font-weight: var(--tg-font-weight-semibold);
      margin: var(--tg-spacing-32) 0 var(--tg-spacing-8);
    }

    .terms-conditions-describe {
      color: var(--tg-text-lightgrey);
      font-size: var(--tg-font-size-xs);
      font-weight: var(--tg-font-weight-default);
      line-height: 22px;
    }
  }

  .check-box {
    display: flex;
    flex-direction: column;
    gap: var(--tg-spacing-12);
  }

  &-btn {
    width: 100%;
  }

}

.app-bottom {
  display: flex;
  flex-direction: column;
  gap: var(--tg-spacing-16);
  margin-top: var(--tg-spacing-16);

  &-text {
    text-align: center;
    font-size: var(--tg-font-size-default);
    color: var(--tg-text-lightgrey);
    line-height: 1.5;
    display: flex;
    flex-direction: column;
    gap: var(--tg-spacing-12);

    .text-white {
      color: var(--tg-text-white);
    }

    .stake-text {
      font-size: var(--tg-font-size-xs);
      cursor: pointer;
    }
  }

  .app-bottom-text {
    span {
      cursor: pointer;
    }
  }
}
</style>
