import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import { Box, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  // const logo = (
  //   <Box
  //     component="img"
  //     src="/logo/logo_single.svg" => your path
  //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
  //   />
  // );

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 100,
        height: 100,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
        <defs>
          <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
            <stop offset="0%" stopColor={PRIMARY_DARK} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>

        <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
          <path
            d="M5.99969 174.501V203.589V255H301V174.127V133H246.83V172.647C246.83 191.183 231.998 206.207 213.706 206.207C195.414 206.207 179 191.183 179 172.647V133H126.418V172.647C126.418 191.183 111.585 206.207 93.2933 206.207C75.0015 206.207 57.9997 191.183 57.9997 172.647V133H30.0749H5.99969V142.458V174.501Z"
            stroke="#ED1C24"
            strokeWidth="10"
          />
          <path
            d="M1.5 60.2451V37.8315V30.999C1.5 14.4322 14.8851 1 31.3937 1H274.606C291.115 1 304.5 14.4322 304.5 30.999L305 60.5V94.5V127.5L244.877 128V67.5489C244.877 50.3515 230.986 36.4111 213.843 36.4111C196.706 36.4111 182.814 50.3515 182.814 67.5489V128H123.192V67.5489C123.192 50.3515 109.294 36.4111 92.157 36.4111C75.02 36.4111 62 50.3026 62 67.5V128L31.3142 128H2L1.5 84.9238V60.2451Z"
            fill="#ED1C24"
            stroke="#ED1C24"
            strokeWidth="2"
          />
          <path
            d="M259 161.99V166.847C259 183.497 245.567 197 229.003 197C212.433 197 199 183.497 199 166.847V125H259V161.99Z"
            fill="#00A651"
            stroke="#00A651"
            strokeWidth="2"
          />
          <path
            d="M137 161.99V166.847C137 183.497 123.567 197 106.997 197C90.4265 197 76.9998 183.497 76.9998 166.847V125H137V161.99Z"
            fill="#00A651"
            stroke="#00A651"
            strokeWidth="2"
          />
        </g>
      </svg>
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
