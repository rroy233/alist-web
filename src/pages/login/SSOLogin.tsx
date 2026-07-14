import { Button, Icon } from "@hope-ui/solid"
import { FiGithub, FiLogIn } from "solid-icons/fi"
import { BsMicrosoft } from "solid-icons/bs"
import { AiOutlineGoogle, AiOutlineDingtalk } from "solid-icons/ai"
import feishuLogo from "../../../images/feishu.png"
import { base_path, changeToken, r } from "~/utils"
import { getClientId } from "~/utils/client-id"
import { getSetting, getSettingBool } from "~/store"
import { useRouter } from "~/hooks"
import { onCleanup } from "solid-js"

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
      const url =
        r.getUri() +
        "/auth/sso?method=sso_get_token&device_id=" +
        encodeURIComponent(getClientId())
      if (usecompatibility) {
        window.location.href = url
        return
      }
      window.open(url, "authPopup", "width=500,height=600")
    }
    if (loginPlatform === "Feishu") {
      return (
        <Button
          w="$full"
          size="sm"
          colorScheme="accent"
          leftIcon={<img src={feishuLogo} alt="" width="18" height="18" />}
          aria-label="Sign in with Feishu"
          onClick={login}
        >
          飞书登录
        </Button>
      )
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
