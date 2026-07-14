import { Icon } from "@hope-ui/solid"
import { FiGithub, FiLogIn } from "solid-icons/fi"
import { BsMicrosoft } from "solid-icons/bs"
import { AiOutlineGoogle, AiOutlineDingtalk } from "solid-icons/ai"
import type { JSX } from "solid-js"
import { base_path, changeToken, r } from "~/utils"
import { getSetting, getSettingBool } from "~/store"
import { useRouter } from "~/hooks"
import { onCleanup } from "solid-js"

// solid-icons does not provide a Feishu mark. Keep it local so the SSO entry
// has the same Icon-based rendering contract as Github, Microsoft, Google and
// DingTalk instead of falling back to the generic login glyph.
const FeishuIcon = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.9 2.5c2.8 0 5.1 1.3 6.1 3.2l-5.2 3.1-2.8-1.7.3-4.5c.5-.1 1-.1 1.6-.1Z"
      fill="#3370FF"
    />
    <path
      d="M19.4 6.8c1.4 2.5 1.3 5.2 0 7.2l-5.3-3.1v-3.3l4.1-.8c.5.1.8.1 1.2 0Z"
      fill="#00B5FF"
    />
    <path
      d="M18.4 15.8c-1.4 2.5-3.8 3.9-6.1 3.9l.1-6.2 2.8-1.7 3.2 2.9Z"
      fill="#00C39A"
    />
    <path
      d="M10.7 20.1c-2.8-.1-5-1.5-6.1-3.4l5.2-3 2.8 1.7-.3 4.6c-.5.1-1 .1-1.6.1Z"
      fill="#FF9C27"
    />
    <path
      d="M3.6 15.2c-1.3-2.5-1.2-5.2.1-7.2l5.2 3.1v3.3l-4 .8c-.5-.1-.9-.1-1.3 0Z"
      fill="#FF5A5F"
    />
    <path
      d="M4.6 6.2C6 3.7 8.4 2.3 10.7 2.3l-.1 6.2-2.8 1.7-3.2-2.9Z"
      fill="#8A63FF"
    />
  </svg>
)

const SSOLogin = () => {
  const ssoSignEnabled = getSettingBool("sso_login_enabled")
  const loginPlatform = getSetting("sso_login_platform")
  const usecompatibility = getSettingBool("sso_compatibility_mode")
  const { searchParams, to } = useRouter()
  const token = searchParams["token"]
  if (token != undefined && token != "") {
    changeToken(token)
    to(decodeURIComponent(searchParams.redirect || base_path || "/"), true)
  }
  function messageEvent(event: MessageEvent) {
    const data = event.data
    if (data.token) {
      changeToken(data.token)
      to(decodeURIComponent(searchParams.redirect || base_path || "/"), true)
    }
  }
  window.addEventListener("message", messageEvent)
  onCleanup(() => {
    window.removeEventListener("message", messageEvent)
  })
  if (ssoSignEnabled) {
    const login = () => {
      const url = r.getUri() + "/auth/sso?method=sso_get_token"
      if (usecompatibility) {
        window.location.href = url
        return
      }
      window.open(url, "authPopup", "width=500,height=600")
    }
    let icon
    switch (loginPlatform) {
      case "Github":
        icon = FiGithub
        break
      case "Microsoft":
        icon = BsMicrosoft
        break
      case "Google":
        icon = AiOutlineGoogle
        break
      case "Dingtalk":
        icon = AiOutlineDingtalk
        break
      case "Feishu":
        icon = FeishuIcon
        break
      default:
        icon = FiLogIn
    }
    return (
      <Icon
        cursor="pointer"
        boxSize="$8"
        as={icon}
        p="$0_5"
        aria-label={`Sign in with ${loginPlatform}`}
        title={`Sign in with ${loginPlatform}`}
        onclick={login}
      />
    )
  }
}

export { SSOLogin }
