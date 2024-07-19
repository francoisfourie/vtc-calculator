$(document).ready(function () {

    let csrfToken = '';
    let capturedImageData = null;

    // Fetch CSRF token when the page loads
    $.get('email_sender.php', function(data) {
        csrfToken = JSON.parse(data).csrf_token;
    });
    
    if ($(window.parent)[0] !== window) {
        // The page is running inside an iframe
        console.log("Page is running inside an iframe.");
        $('#topbar').removeClass("d-flex").addClass("d-none");
    } else {
        // The page is not running inside an iframe
        console.log("Page is not running inside an iframe.");
        //$('#topbar').removeClass("d-none").addClass("d-flex");
    }

    function captureAndWhatsApp() {
        
        const screenshotheadercontent = `                <div class = "responsive-font-table" style="border-top: 1px solid #cccccc; padding-top: 10px; width: 100%;">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
          <div style="flex-shrink: 0; margin-right: 20px;">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPkAAABpCAIAAAB3SxKEAAAAA3NCSVQICAjb4U/gAAAXjUlEQVR4nO1dbWhT1/8/3d91QtpGmSO2xYDxYUVDWo3gEqqdsQ+R4UMsKUxZU0Kd+JDgRNHQMsroaIvipKuVbRKaigqG1mopzVpRKuMWxaoNqYqueRGdbd7Mpea+GYP+X3zn+Z3dPJ0856b386Lc3pz7PU+fc873PHy/J2d+fh4JWHhgWXZ6ehohpFAo0p2WFGFRuhMgIOlgWdbpdD5+/Pj58+evX7/2eDxBg6nV6oKCAqVSWVpaKpPJUpzIFCAnw/t1t9t9/vx5mpBtbW0ikSghkY6Pj1+7di0holKGTZs21dfXk29Ylh0ZGbl586bL5YpWmlgsrq6u3rFjRzb1+pnOdYTQ9u3bfT5fxGBtbW1VVVUJibG5udnhcCREVAogFotbW1tVKhV+4/V6e3p67HZ7/MKlUumhQ4cSVbDpxQfpTkBkVFdX0wQbGxtLSHQsy/KI6HK5/OrVq5joLMt2dHR88cUXCSE6Qsjj8VgsloaGBqfTmRCBaQQPuL5161aaYIkiKI8qVa/X9/T0SCQS+Hd0dHTXrl2JYjkJl8tlNBq7u7tZlk248JSBB1xXqVRisZgm5Pj4ePzR3bt3L34hKUBbW9upU6fgGbpzi8VCo+zFDKvVeuTIEa/Xm7wokgoecB1RqzEJoenIyEj8QpINcnLCsuyRI0eS0Z0HwuVy7du3z+12pyCuhIMfXN+4cSNNsPhpOj4+ntSuMSFoamriED2GlZaY4fP5Dhw4wEe684PrarWaJpjP54tTjcl8BUar1ep0OnhOPdEBPp/vxIkTvNPd+cF1kUik1WppQj5+/DieiDJcgRGLxRaLBf9rsVhST3QArM+kJeqYwQ+uI4QqKipogt2+fTvmKJxOZ4YrMKdPn8b7Zd3d3QzDxCxK/R5SqTQ2CQzD3LhxI+YEpB68OSNAqcZ4PB632x3bFvdvv/0Ww1cpg1QqxWq60+m0Wq3RStDr9Vu3blUoFJwNZjhEcO/evWgnuF1dXdXV1Ynark42eLBvikG5nWk0Gg8fPhyD/L1794Y6K0LCbDaXlZVRyjQajTTBaIgrkUjwUjplUslkGAyGiKRkWdZms0XVisxmM+dsQsaCT1wfHR2l0RGlUml/f3+0wt1ud11dHU3IsbEx+p5s06ZNNMEePnxIKRAh1Nvb29nZSRlYKpWePXs2qoHO6XR+8803lOqcWCy+desWL7p23ujrKEo1JlrhlNuuWq02vfUKXS9lYLlcfvny5Wg1OoVCcfXqVblcThPY5/Nl+IQeg09cF4lElHSfnJyMVjjlpJZyipw89PX1Ufa4Uqn0woULsbVMiUTy7bffUm5X37x5M4YoUg8+cR0htG3bNppg0Za+2+2mVH8pG1vyQN+pnz17Np4hSCaTtba20oR0uVy8ODjAM65TUi3a0qdcgUm7AjM6OkrZqZvN5vjtLVQqFWWB8+LAHM+4LpFIKPXIqNae79y5QxMs7QoM5bllsVhcW1ubkBgbGxtpgr18+TIh0SUVPOM6Qmj37t00we7evUsp0Ov1Uu4+pleBoT9YT7O8SAmFQkGjtT9//jwh0SUVvNlLwqAkHMMwLMvSVDnlCJB2BYZeT0hUp46lRaRycXFxAmNMEvjHdVBjaHpihmFojMcoJ7JpV2Aoj/okvE3GtjGXgeCfDoOo1Rga7ZYvCgyi1hPS3iYzFrzkOiXtHA5HxHOnfFFgEHVSs8nyP7HgJdclEgnl6byIOu7ExASNHKVSSRMseaDcCRaLxfjMjAAOeMl1hFBlZSVNsPC2F/QrG2lXYPx+P02w9evXJzsl/AVfuU5puhH+qAalViCXy9PeWYI/uogoKSlJdkr4C75yXSaT0agx4a3yKLdmKKfCScW7d+9oguXl5SU7JfwFX7mO4lZjeKTACEgIeMz1ONUYHikw9CgsLEx3EjIXPOY6vRoTdBGDRwoMPXjULFMPHnMdUasxQXUVSu8a/FJgeHG2Nl3gN9fLy8tpggXaYVD6POKXAoMQmpmZSXcSMhf85jrlKbxAqzxKn0f8UmAEhAe/uY6oXT1yrDEoTSQzR4GhnHS+ePEi2SnhL3jPdUqP1aQ1Bh8VGMqUzM3NJTsl/AX/zvRyAB6rI3IXrPKAMXxUYCi5Ho8nsFDAt4iFB+m+JjPBe64jhKqrq2kcVjEMA14/79+/TyM2cxQYhJBEIqFp0gghp9OZ2KOO09PTNB6drFZrhnOd9zoMolZjwCaD0mVARikwAMpzXQn31Ed5FCfzkQ1cp7x4A9QYynMBGaXAAChdiMXjvTUoKI89Z/65+WzgOqJejXE6nZRUyCgFBkC5meDxeBLrwYJm0y1mZ7+pRJZwnfLijYsXL/JUgUHUZyIQQpcuXUpUpJRrVuvWrUtUjMlDlnCd3tUjTbAMVGAAlGciGIZJVNdOeadx2u22aJAlXKe/eIMGGajAAOjz2NLSEv8dL06nk3IRM2NLjESWcB0lzn4+MxUYgEwmox/Burq64omLZdmWlhaakJlcYiSyh+uJ6loyVoEBUDqdQwjZ7fbu7u6YI+rq6qJU+fbv3x9zLKlE9nA9UWpMhg/HCoWCPoVWq7WjoyOGWDo6OijvkxGLxRleYhjZw3WUCDWGF8MxfdeOELLb7Q0NDfSXL7As29zcTH9xUgJ9RyYbWcX1+DuYDFdgAAqFgvIaJoDL5aqrq+vo6Ai/Uu71ent7e3ft2kW53YYS6hA4BciG8zAYIpGI0tVjKPBlODYYDLdv347qejC73W6328Vi8fr16zlbsDMzM8+ePYuh3Mg7KDMfWcV1hNDu3btj5jovFBiASCQ6e/bsgQMHor2Q1efzMQyTkOOQarWaxjVs5iCrdBgUX8fMCwUGQyaTnT59Ol2xi8Xitra2dMUeG7KN6/QXbwSCLwoMRlVVVVoIJxaLf/nlFx5pL4Bs4zqKtXvmkQJDIvV0B6LHfxlT6pGFXI+te+aXAkOiqqrKarVS3s8YJ/hLdJSVXI9NjeGdAkMCbt9NdhbkcvnVq1d5SnSUlVxH0XfSPFVgSEgkks7OzqampiR18Gazuaenh9ellJ1cLy0tjSo8fxUYDnQ63a1bt8xmcwIZr9frh4aG6uvrEyUwXciZn59PdxqSgr1799JvtQwNDSWpx6I0nHv48GFi42VZlmGYK1euxLzbAHuitbW1vO7LSWQt191uN+VdFCiZtpKUNhPJS4DX62UYZmJi4unTpzSNX61Wl5SUlJeXZ779aLTIWq4LCApoe16vl/T8uGbNGpFIlPkOXuKEwHUBCwXZOTcVICAQAtcFLBQIXBewUCBwXcBCgcB1AQsFAtcFLBQIXM8gOJ1OeiPoMHC73QmRw1N4vV6n0xnoCmoRIrbTx8bGOAfwse8EvIve29vb2dkZNA5yo9tsNjMMo1arQwXGm+fkV1h4mD3zULvuZrM5zJkNp9MZ3h4Zxxg+YXK5vKenh/wwMM2Q91ARBaZzfHz8p59+Ijfz5XL58ePHo925dDqd586dI+VotVqLxRLKqGL79u0+n89oNB4+fDhoALKowVC1uLi4oaGBs+UUW41wvg0kD0JIr9efOnWKIzMUr1iW7erqGhkZwXaJnGL8ACG0Z88e+CewhuBeoSw4BpgouFyuGzduJFBgc3OzyWTinFpxuVxGozEqT0bd3d1Go5Ejx+FwfPXVV0H7+NHRUeBEX18fjXwwVLXb7fv27UvZoGG32ykPWbjd7l27dtntdtIAF4oR19cihFBNTQ20krGxMdJaFvtoDerYyWw2x5GLeKHX6znXZZWVlYUJL5FIcIJnZmZgsAoUQoOuri61Wh2m8e/cuRN3V1CwarUavyHT2dvbCw4q4KBVeXk5y7KPHz+2Wq0IIavVSnkuZXx8HD5BCBmNxg0bNohEouvXr4fxfjE4OAgPPp9vdHQ0jJU0TvzDhw8ZhvH5fOfPnw/sVsk8BuY0Zpw7d44zkAaCZVlsZq5Wq3fu3CmRSJ48eWKz2UjqL0LvjRtcLpfD4SCHPHyvUFAjgPQe8tyxY0dUQ7xEIsEJdjqdwPVohcAtLj6f78cff2xtbQ0VjOQNcGLTpk2BxeX1em02G0JIKpWePXsW20CoVKry8nLQuFpaWi5fvhzespNl2TNnzsCz1WrFOVIoFBUVFWq1OvBzOBCGczQ4OBiG6zjx9fX1oEIE1dCC5jF+wEAKl/+EAuY0qfMoFIry8nK/3/8fHQYRPTeZDVBg9Ho976xok4T169dDs3c4HPE7fe7r64MaOnToEMfYR6FQ6PV6hJDH44no34JhGJhumc1mTtOtqqoKWnegt0il0qNHj4IEyguvi4uLaYIlBHK5HE7hd3V1hfc5DGOaVCrlKPcymYwskH/9w+CeG6sxWIEJdRtRb28v+W9ZWVkqT4EODw8/efKEfJOacaapqemLL75ACLW0tPT398cj6vnz5/AQtE/V6/Uw+ES8ivrRo0fwUFNTQxMvy7LA9crKSlzvfX19oWao+CuGYfD8LTBA4HJCnDVSUFBw+vRpi8Xi8/m6uro4PMbAnQ6edobCv1wHx58OhwOrMaDASKVSlUoV9EuOxhbYqSQVgQ4HU8N10Ps7Ozs9Hk9vb2/8kYYyEsU9fcTref/44w+cNpoYQedGCGm1WolEAvUehuudnZ2cutZoNEHFcoag+AunqqpqcHAQ5sQRFc41a9aEl/a/9XXortB7NQZaMOVFDgsKtbW1cJeLzWajHPrDIOLtu/n5+XFGwcGVK1cQQnK5HJoTOHyFGWrEb6VSKc1KYgJx7NgxeIjoDD6iac7/fNzhS3HHxsYQQtD0w3imTLjZWFQgJ2EphkgkOnnypMlkgknq2rVr45EWykYOD80RV4qwDo0vKw4Dt9sNMRYUFIAWiikSaoaq1+t37NiBIt3Wm6Q2IJPJjEaj1WqFgTRMyJcvX4b3ufeffVO4Tc7hcMCClLCsHgoqlQpPUmNu8yUlJfAQtAqvX78ODxGHZnwvWsS1OUTofgzDgHKCFytDzVALCwsVCoVCoUgXGQwGA0xSbTbb69evOb/iLq+vry/8FPY/XIe5P3qvxvDlvoS0oKmpCR5i9gNaW1uLq5CzOzM6OgpL42q1OtR8CUOtVoNOZbfbOXpIR0cH2ZBYlgXVVCqVqgnguSblvlKKIRKJwHOlz+cLajILOycwhSXpPjo6ajab8Zv/+OmFWwWxuPC+dQJ7o5qaGk7Tf/36NScY5TAXcZEncB2msLAwlW5jJRIJjK3xSDAYDJ2dnT6fr66uzmg0rlmzxu/3T0xM4D0grK2GAdapEEIWi+XRo0cbN270+/13796Fduj3+2HeiWelhw4d4pQVnBOJuBoTBoHjWwJrBE9Sg/5aW1s7MDDg8XjsdvuzZ880Gs2aNWvwltyuXbtu3bolEom4Pqn37NkDk+6Iy+qBO2dlZWUcrns8Hk4wSq5HXOQJXIdJvYtkg8GA18hjQ319vd/vx7uk5E9isbi1tZXSyZZKpYLVIfTezzr+SS6X40kXzEqD3vpSWVlptVoj7qGGQeA6TGJr5NixY6G4Dh66T5w44fF4XC4XZwqEncRzuV5TUwMNFKYjgSgsLAzV3+fl5eFnrIxGhVDCyflZqNjpY8zLywMhZIJpEsaJQiQStba2hr8BFCIKM788fPhweXn5pUuXpqamoNlIpdJ169aZTKao9OP6+vry8nKr1Yo3RqRS6ebNm48ePQo17fV6CwoKYCc/sBerra2F9X5yOT9i4slggYiNA/hDzucymcxsNgM5AyXLZLLLly/bbLYHDx4A1+GwWmNjI+4lBT8CGQSv15uXlxf/LjVoqAt5t9vtdgcOiQLXBSwUCLYaAhYKBK4LWCgQuC5goSBHqVSmOw0CBKQCQr8uYKFA4LqAhQJhzVHAQoHQrwtYKBC4LmChQOC6gIUCgesCFgr+5TrLskFtOkK9zygkJIVpz2Zaijqpkaa3SINkze/3NzU1KZVKpVLZ3t4+T6C9vR3eNzU1+f1+/F6pVF64cGF+ft5ms9lsNnjJMIxGo4FnjUbDMAw822w25XvgwBcuXNDpdH6/f3p6WqlUTk5OYuE6nc5kMpHJAAmzs7MQddAUmkwmnMLJyUkcIynKZDLBS51Oh5M3Pz/f398fKCRakInkpIHMIPkSl8b8/DyugqamJlIsDmwwGLBweA+fm0wmUk7QSHU6HYSx2Ww6nS6w9Dj1Tg+cYJvNRhb19PS0TqdTKpUajWZkZAS/x1XAqZr29nZMHkCoSoQ3EYMFzRrq7+8PSruRkRGNRuP3+/1+v06n6+/v58Q3PT1Nch3ew4F9Mt2cUgCATPiJTM3k5KRGoyFJM/+eRiCEzCekcHZ2FqThMoX8zwcA0+LChQtkkiAlfr/fZDJNT08HfkgDnU6n0WjI0giV98nJSc7LkZERqAJORiC/UCMGgyGQ07Ozs4FcJzsOAMMw8J7zK9QXCImtkeNGxckprlbMIjL7nNrx+/3QAZEZx8H8fr9Go+F0FmSwwBIOlbVFExMTe/bsEYlEMpmMNKOamZmprq6GM9B79uyZmJgg/Yyp1ervvvuO4ydEq9WCVxmw0caYmpoCi8Bjx47BqWJsNiYWi9va2nDI4eHh2traN2/e/Prrr6QFk1wun5qa4hhTzszMrF+/HgwaAt0SQYwlJSWkUdnDhw/9fv/t27dJvzlgijUwMLB58+bYzIedTqfP52ttbT1z5kwMtvSPHj2qrKzERf3o0SPSnGd4eHh4ePjVq1cc94h6vf77778PlHbu3LmCggJE2HapVCqtVms0GrVaLWnepdfrTSaTXC7XaDQxH3bXarUtLS0cP0QMw4CZVVVVlcVimZ6eDuP0gWEYSEOgI4Pe3l5wjxOmXjC7du7ciT8PmrUPioqKsClKc3MzaeT77NkzeJiZmSkqKiIj+PLLL+fm5gYGBsiXFRUV9+/fv3//PsdV2IoVKxobGxsbG8kUq1QqMA/DSQHL3wcPHjx9+pQjGVxAtbe3c/KJnat0d3ePj4+TP0GMWq2WfFlcXLxhw4aCggKOM62hoaGTJ0/ev38fTI+jxfDwMELo2rVrHo+HkwwaFBYWvnnzBp5fvHjBsQNau3YteArgGPkfPXp0ampqamqKI2337t2Qd/IltkbFb7xeb2Fh4djY2P79+zs7O2N22VdXV1dQUACOKTHEYjHoyvA3vP3XlStX5ubm7ty5E+jIoKysTKlU+ny+MKo/ZhduTpC1oaEhTtYWgZvM/Pz8N2/ejI+P4+Koqamx2WzgFtlut3OsIUUiUUtLC8ejuVqttlgsYrGYY/o+NzeH7aDJ9l1QUECWAsMwYrG4p6eHZdmKiorx8XFSTqB1LaSwubm5qKjIarUODQ2RkeIYSfuUwsJClUr18uVLcgQbGBh48eLF2rVrfT7f8uXLQ5VpKEAT/eGHHxQKRUdHx9DQUETLfw7ATzL0Jg6HA3iJsWrVKoVCMTg4yGmfYF1P0hfw4sWLd+/eof+6c4EHsvPOy8uz2WwzMzPQtOjNEQNx/PhxDhMMBkNzc7PBYLhz545arQ5jNQv+asDxf0NDA2c8B18dN2/e9Hq9oYRgdmFTbsga9nuDs/Z/Fy9erKysnJ2d/fjjj0+dOrV06VIcYsuWLbOzs3///bfFYiEt/BYvXlxaWrpq1apPPvlk3bp1uEBzc3NXrlxZXl6+atUqHDgnJ2fJkiXwvHz5crJrX7Ro0erVq/Ebt9u9bdu2FStWgJylS5fCTzk5OcXFxatWrdq4ceOyZctKS0vJFLIsm5ube/DgQTLSZcuW4WccHkeXn5//zz//4Peff/75X3/9hRDasWMHOMGKCm/fvs3LywO1raioiGVZLBmnnPPJkiVLyJd5eXmVlZW///47QshisaxYsQL/BEWdl5e3ZMmSjz76CH8VqgoWL16M/YStXr2aZDB8gv/Nzc3dsmXL27dvEUIHDx6MzTYUJ2PlypWffvopTl5paWlRUdHs7OymTZsOHjyYm5tLfkVW4qtXrz777DOIXSaT5eTkYCE4mEgkwmT4+eefEUJff/01lvbhhx/CQ35+Pnybm5u7YcOGP//8E4iBsyachxGwUPD/RTCIMboo1xoAAAAASUVORK5CYII=" alt="Velile Tinto Cape Logo" width="120" style="display: block;">
          </div>
          <div style="text-align: center;">
            
              <strong>Velile Tinto Cape</strong><br>
              <a href="https://veliletintocape.co.za" style="color: #333; text-decoration: none;">www.veliletintocape.co.za</a><br>
              Email: <a href="mailto:info@veliletintocape.co.za" style="color: #333; text-decoration: none;">info@veliletintocape.co.za</a>
            
          </div>
        </div>
      </div>`;

        // const maintabContent = document.getElementById("maintab");

        // const screenshotContent = maintabContent.cloneNode(true);
        // // Use jQuery to set the content of screenshotheader in the cloned element
        // $(screenshotContent).find("#screenshotheader").html(screenshotheadercontent);

        // if (!screenshotContent) {
        //     console.error("Element with id 'maintab' not found");
        //     return Promise.reject("Capture element not found");
        // }

        // // Temporarily append the cloned element to the DOM
        // document.body.appendChild(screenshotContent);

        //return html2canvas(screenshotContent);
        // Use html2canvas to capture the contents of the cloned element
        // return html2canvas(screenshotContent).then(canvas => {
        //     // Do something with the canvas
        //     document.body.appendChild(canvas);

        //     // Remove the cloned element from the DOM after capturing
        //     document.body.removeChild(screenshotContent);
        // });

       // $("#screenshotheader").html(screenshotheadercontent);

        const captureElement = document.getElementById("maintab");
       
        if (captureElement) {
            console.log("Element found:", captureElement);
    
            // Get the dimensions of the original element
            const elementWidth = captureElement.offsetWidth;
            const elementHeight = captureElement.scrollHeight;
            //const elementHeight = captureElement.offsetHeight;

            // Create a clone of the captureElement
            const screenshotContent = captureElement.cloneNode(true);

            // Add the header content to the clone
            $(screenshotContent).find("#screenshotheader").html(screenshotheadercontent);

            // Create an off-screen container for the screenshot content
            const offScreenDiv = document.createElement('div');
            offScreenDiv.style.position = 'fixed';
            offScreenDiv.style.top = '-9999px';
            offScreenDiv.style.left = '-9999px';
            offScreenDiv.style.width = `${elementWidth}px`;
            offScreenDiv.style.height = `${elementHeight}px`;
            offScreenDiv.style.overflow = 'visible';

             // Set the width and height of the clone to match the original element
             screenshotContent.style.width = `${elementWidth}px`;
             screenshotContent.style.height = `${elementHeight}px`;
             
            offScreenDiv.appendChild(screenshotContent);
            document.body.appendChild(offScreenDiv);

            html2canvas(screenshotContent, {
                scrollY: -window.scrollY,
                height: screenshotContent.scrollHeight,
                windowHeight: screenshotContent.scrollHeight
              }).then(canvas => {
                
                console.log("Canvas created:", canvas);
                $("#screenshotheader").html("");
                canvas.toBlob(function(blob) {
                   
                    if (blob) {
                        console.log("Blob created:", blob);
    
                        // Create a URL for the blob and log it
                        const blobUrl = URL.createObjectURL(blob);
                        console.log("Blob URL:", blobUrl);
                        const a = document.createElement('a');
                        a.href = blobUrl;
                        a.textContent = "View Screenshot";
                        a.target = "_blank";
                          // Append the anchor element to the body (or another element) to make it clickable
                          //TODO : Hide when not DEV
                          document.body.appendChild(a);

                        if (navigator.share) {
                            navigator.share({
                                files: [new File([blob], 'vtc.png', { type: 'image/png' })],
                                title: 'vtc',
                                text: 'VTC-calculator'
                            }).then(() => {
                                console.log('Shared successfully');
                            }).catch(error => {
                                console.error('Error sharing:', error);
                            });
                        } else {
                            // Fallback for devices that don't support Web Share API
                            var url = URL.createObjectURL(blob);
                            var whatsappLink = document.createElement('a');
                            whatsappLink.href = "whatsapp://send?text=" + encodeURIComponent("VTC-calculator! " + url);
                            whatsappLink.click();
                            console.log('WhatsApp link created and clicked:', whatsappLink.href);
                            setTimeout(function() {
                                URL.revokeObjectURL(url);
                                console.log('URL revoked:', url);
                            }, 100);
                        }
                    } else {
                        console.error("Failed to create Blob from canvas");
                    }
                }, 'image/png');
            }).catch(error => {
                console.error("html2canvas error:", error);
            });
        } else {
            console.error("captureElement not found");
        }
       
    }

    // $(document).on('click', '#captureAndEmail', function() {
    //     captureScreen().then(function(canvas) {
    //         capturedImageData = canvas.toDataURL("image/png");
    //         var emailModal = new bootstrap.Modal(document.getElementById('emailModal'));
    //         emailModal.show();
    //     }).catch(function(error) {
    //         console.error('html2canvas error:', error);
    //     });
    // });

    $(document).on('click', '#captureAndWhatsApp', function() {
        captureAndWhatsApp();
    });

    // $("#captureAndEmail").click(function() {
    //     captureScreen().then(function(canvas) {
    //         capturedImageData = canvas.toDataURL("image/png");
    //         var emailModal = new bootstrap.Modal(document.getElementById('emailModal'));
    //         emailModal.show();
    //     }).catch(function(error) {
    //         console.error('html2canvas error:', error);
    //     });
    // });

    $("#sendEmailBtn").click(function() {
        const recipientEmail = $('#recipientEmail').val();
        if (!recipientEmail) {
            alert('Please enter a valid email address.');
            return;
        }

        $.ajax({
            url: 'email_sender.php',
            method: 'POST',
            data: {
                csrf_token: csrfToken,
                to: recipientEmail,
                subject: 'Screen Capture',
                message: 'Please find the screen capture attached.',
                image: capturedImageData
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    console.log('Email sent successfully');
                    $('#emailModal').modal('hide');
                    alert('Email sent successfully!');
                } else {
                    console.error('Failed to send email:', response.message);
                    alert('Failed to send email: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX error:', status, error);
                alert('An error occurred while sending the email.');
            }
        });

        var emailModal = bootstrap.Modal.getInstance(document.getElementById('emailModal'));
            if (emailModal) {
                emailModal.hide();
            }

    });

    // $("#captureAndWhatsApp").click(function() {
    //     captureScreen().then(function(canvas) {
    //         canvas.toBlob(function(blob) {
    //             if (navigator.share) {
    //                 navigator.share({
    //                     files: [new File([blob], 'screenshot.png', { type: 'image/png' })],
    //                     title: 'Screenshot',
    //                     text: 'Check out this screenshot!'
    //                 }).then(() => console.log('Shared successfully'))
    //                   .catch((error) => console.error('Error sharing:', error));
    //             } else {
    //                 // Fallback for devices that don't support Web Share API
    //                 var url = URL.createObjectURL(blob);
    //                 var whatsappLink = document.createElement('a');
    //                 whatsappLink.href = "whatsapp://send?text=" + encodeURIComponent("Check out this screenshot! " + url);
    //                 whatsappLink.click();
    //                 setTimeout(function() {
    //                     URL.revokeObjectURL(url);
    //                 }, 100);
    //             }
    //         });
    //     }).catch(function(error) {
    //         console.error('html2canvas error:', error);
    //     });
    // });


    // $("#captureAndEmail").click(function() {
    //     html2canvas(document.getElementById("maintab")).then(function(canvas) {
    //         var imgData = canvas.toDataURL("image/png");
            
    //         $.ajax({
    //             url: 'email_sender.php',
    //             method: 'POST',
    //             data: {
    //                 csrf_token: csrfToken,
    //                 to: 'recipient@example.com',
    //                 subject: 'Screen Capture',
    //                 message: 'Please find the screen capture attached.',
    //                 image: imgData
    //             },
    //             dataType: 'json',
    //             success: function(response) {
    //                 if (response.success) {
    //                     console.log('Email sent successfully');
    //                     alert('Email sent');
    //                 } else {
    //                     alert('Failed to send email:', response.message);
    //                     console.error('Failed to send email:', response.message);
    //                 }
    //             },
    //             error: function(response) {
                    
    //                 console.error('AJAX error:', status, error);
    //                 alert('AJAX error:', status, error);
    //             }
    //         });
    //     });
    // });

        // To handle the close button and top-right (x) button:
        $(document).on('click', '[data-bs-dismiss="modal"]', function() {
            var emailModal = bootstrap.Modal.getInstance(document.getElementById('emailModal'));
            if (emailModal) {
                emailModal.hide();
            }
        });
})

// transfer
function calculateTransfer(event) {
    cleanScreen();
    event.preventDefault()
    var tranval = document.getElementById("amntt").value.replace(/,/g, '') ;

    var data = getFees(tranval);

    //from sheet, exclude VAT
    var tf = parseInt(data.transfer_duty)
    var dof = parseInt(data.deeds_office_charge)

    var af = data.fee
    var ps = 350.00

    var SCandFS = 100.00 //new
    var Transfee = 375.00 //FF new 05/07/2024
    var ratesclearcert = 80.00 //new
    var fica = 800.00  //FF new 05/07/2024
    var dgf = 607.00
    var erf = 1000.00
    var pp = 950.00
    var etdf = 325.00 //FF new 05/07/2024

    var payverlexis = 225;
    var accverfee = 17.5;
    var elecfacfee = 625;


    var subtotal = af + ps  + dgf + erf + pp + SCandFS + Transfee + fica + ratesclearcert + etdf + payverlexis + accverfee + elecfacfee;

    var vatcalc = (15 / 100) * subtotal
    var vat = vatcalc
    
    
    var tc = subtotal + vatcalc + dof + tf 

    var total = tc

    setResult(
        `
            
            <div style="overflow-x:auto;" class="result">
            <div class="form-header bg-secondary text-white py-2 px-3 rounded">
            <h6 class="h6 m-0">Transfer costs on R${numberWithCommas(tranval)}</h6>
            <div class="icon-buttons">
                
                <a href="#" id="captureAndWhatsApp" title="Share">
                    <i class="fas fa-share"></i>
                </a>
            </div>
        </div>
                        
<hr/>
        <table class="table responsive-font-table">
        <tr >
        <td colspan="2" > <b>GOVERNMENT COSTS </b> </td>
        </tr>
        <tr>
        <td>Deeds Office Fees</td>
        <td  >R${numberWithCommas(dof)}</td>
        </tr>
        <tr>
        <td>Transfer Duties</td>
        <td  >R${numberWithCommas(tf)}</td>
        </tr>
        <tr>
        <td colspan="2" > <b>ATTORNEYS COSTS </b> </td>
        </tr>
        <tr>
        <td>Attorney Fee</td>
        <td  >R${numberWithCommas(af)}</td>
        </tr>
        <tr>
        <td>Property Search</td>
        <td  >R${numberWithCommas(ps)}</td>
        </tr>
        <tr>
        <td>Postage & Petties</td>
        <td  >R${numberWithCommas(pp)}</td>
        </tr>
       
        <tr>
        <td>Document Generation Fees</td>
        <td  >R${numberWithCommas(dgf)}</td>
        </tr>
        <tr>
        <td>Electronic Rates Application Fee</td>
        <td  >R${numberWithCommas(erf)}</td>
        </tr>
        <tr>
        <td>FICA</td>
        <td  >R${numberWithCommas(fica)}</td>
        </tr>
        <tr>
        <td>Secure Chat and File Storage</td>
        <td  >R${numberWithCommas(SCandFS)}</td>
        </tr>
        <tr>
        <td>Transfer Duty Submission Fee</td>
        <td  >R${numberWithCommas(Transfee)}</td>
        </tr>
        
        <tr>
        <td>Rates Clearance Certificate Fee</td>
        <td  >R${numberWithCommas(ratesclearcert)}</td>
        </tr>
        <tr>
        <td>Electronic Transfer Duty Fee</td>
        <td  >R${numberWithCommas(etdf)}</td>
        </tr> 
        
        <tr>
        <td>Payment verification via Lexis Pay</td>
        <td>R${numberWithCommas(payverlexis)}</td>
        </tr>
        <tr>

        <tr>
        <td>Account verification and payment fee</td>
        <td>R${numberWithCommas(accverfee)}</td>
        </tr>
        <tr>

        <tr>
        <td>Electronic Facilitation Fee</td>
        <td >R${numberWithCommas(elecfacfee)}</td>
        </tr>
        <tr>

        <tr >
        <td colspan = "2"></td>
        
      </tr>

        <tr >
    <td>VAT</td>
    <td>R${numberWithCommas(vat)}</td>
  </tr>

        <tr class="table-secondary">
        <td><b>Total</b></td>
        <td  ><b>R${numberWithCommas(total)}</b></td>
        </tr>
            </table>
            <hr/>
        </div>
        `
    )

}

// Bond
function calculateBondCosts(event) {
    cleanScreen();
    event.preventDefault()

    var tranval = document.getElementById("amnt").value.replace(/,/g, '');

    var data = getFees(tranval);

    var af = data.fee

    var ps = 375.00
    var dgf = 1550.00 //FF New 05/07/2024
    var eff = 1000.00 //FF New 05/07/2024
    var pp = 950.00
    var fica = 250.00
    var dosearchfee = 545;

    var subtotal = af + ps + dgf + eff + pp + fica + dosearchfee
    var vatcalc = (15 / 100) * subtotal;

    var vat = vatcalc

    var dof = parseInt(data.deeds_office_charge)
    var tc = subtotal + vatcalc + dof

    var total = tc


    setResult(`
            <div style="overflow-x:auto;" class="result">
            
            <div style="overflow-x:auto;" class="result">
              <div class="form-header bg-secondary text-white py-2 px-3 rounded">
                <h6 class="h6 m-0">Bond costs on R${numberWithCommas(tranval)}</h6>
            </div>
            
       
            <table class="table responsive-font-table">
            <tr >
            <td colspan="2" > <b>GOVERNMENT COSTS </b> </td>
            </tr>
            <tr>
            <td>Deeds Office Fees</td>
            <td  >R${numberWithCommas(dof)}</td>
            </tr>
        <tr>
        <tr>
        <td colspan="2" > <b>ATTORNEYS COSTS </b> </td>
        </tr>

        <td>Attorney Fee</td>
        <td  >R${numberWithCommas(af)}</td>
        </tr>  
        <tr>
        <td>Property Search</td>
        <td  >R${numberWithCommas(ps)}</td>
        </tr>
        <tr>
        <td>Postage & Petties</td>
        <td  >R${numberWithCommas(pp)}</td>
        </tr>
        <tr>
        <td>Document Generation Fees</td>
        <td  >R${numberWithCommas(dgf)}</td>
        </tr>
        <tr>
        <td>Electronic Facilitation Fee</td>
        <td  >R${numberWithCommas(eff)}</td>
        </tr>
        <tr>
        <td>FICA</td>
        <td  >R${numberWithCommas(fica)}</td>
        </tr>
        <tr>
        <td>Deeds Office search Fee</td>
        <td  >R${numberWithCommas(dosearchfee)}</td>
        </tr>
        <tr >
        <td colspan = "2"></td>
        
      </tr>

        <tr >
    <td>VAT</td>
    <td>R${numberWithCommas(vat)}</td>
  </tr>

        <tr class="table-secondary">
        <td><b>Total</b></td>
        <td  ><b>R${numberWithCommas(total)}</b></td>
        </tr>
            </table>
            <hr/>
        </div>
        `)


}

// Loan Calc
function calculateInstalments(event) {
    cleanScreen();
    event.preventDefault()
    //Look up the input and output elements in the document
    var amount = document.getElementById("Loan_price");
    var apr = document.getElementById("Interest_per");
    var Loan_Years = document.getElementById("Loan_Term");


    var principal = parseFloat(amount.value.replace(/,/g, ''));
    var interest = parseFloat(apr.value.replace(/,/g, '')) / 100 / 12;
    var payments = parseFloat(Loan_Years.value.replace(/,/g, '')) * 12;

    // compute the monthly payment figure
    var x = Math.pow(1 + interest, payments); //Math.pow computes powers
    var monthly = (principal * x * interest) / (x - 1);

    // If the result is a finite number, the user's input was good and
    // we have meaningful results to display
    if (isFinite(monthly)) {
        // Fill in the output fields, rounding to 2 decimal places
        var MonthlyP = monthly;
        var GrandTotal = (monthly * payments);
        var interestP = ((monthly * payments) - principal);

        setResult(
            `
    
    <div style="overflow-x:auto;" class="result">
              <div class="form-header bg-secondary text-white py-2 px-3 rounded">
                <h6 class="h6 m-0">Instalments Costs on R${numberWithCommas(principal)}</h6>
            </div>
    
        <hr/>
            <table class="table table-striped responsive-font-table">
        <tr>
        <td>Pay-off time</td>
        <td>${numberWithCommas(Loan_Years.value)} Years</td>
        </tr>
        <tr>
        <td>Monthly payment</td>
        <td  >R${numberWithCommas(MonthlyP)}</td>
        </tr>
        <tr>
        <td>Total capital paid</td>
        <td  >R${numberWithCommas(principal)}</td>
        </tr>
        <tr>
        <td>Total interest paid</td>
        <td  >R${numberWithCommas(interestP)}</td>
        </tr>
        <tr>
        <td><b>Total amount paid</b></td>
        <td  ><b>R${numberWithCommas(GrandTotal)}</b></td>
        </tr>
            </table>
            <hr/>
        </div>`
        )

    }
    else {
        issue("Please enter a valid value")
    }

}


function issue(t) {
    // $("#alertMessage").html(`${t}`)
    // jQuery('.alert').removeClass('hide')
    // jQuery('.alert').removeClass('fade')
    showAlert(t,'danger');
}

function cleanScreen() {
    // $("#alertMessage").html("");
    // $('.alert').addClass('hide');
    // $('.alert').addClass('fade');
    $('.alert .btn-close').click();
    //$("#result").removeClass("light-border");
    $(".tabcontent").removeClass("d-none");
}



// Tabs

function openTab(evt, cityName) {
    // Declare all variables
    cleanScreen()
// Get all buttons with class="nav-button" and remove the class "active"s
    var buttons = document.getElementsByClassName("nav-button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }

    // Add the "active" class to the clicked button
    event.currentTarget.classList.add("active");


    var i, tabcontent, tablinks;

   $("#result").html("")

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";

}


function numberWithCommas(x) {
    // var y = parseInt(x)
    x = parseFloat(x);
    return x.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

$(".sumButton").addClass("hidden")

// find value
// Function to get fees for a specific bond amount
function getFees(bondAmount) {
    const feesData = getCostsFromFile();

    // Extract the minimum and maximum bond amounts from the fees data
    let minBondAmount = Infinity;
    let maxBondAmount = -Infinity;

    for (const feeEntry of feesData.fees) {
        if (feeEntry.bond_amount_range.includes("-")) {
            const range = feeEntry.bond_amount_range.split("-");
            const lowerBound = parseFloat(range[0].replace(/,/g, ''));
            const upperBound = parseFloat(range[1].replace(/,/g, '')) || lowerBound;

            if (lowerBound < minBondAmount) minBondAmount = lowerBound;
            if (upperBound > maxBondAmount) maxBondAmount = upperBound;
        } else {
            const amount = parseFloat(feeEntry.bond_amount_range.replace(/,/g, ''));
            if (amount < minBondAmount) minBondAmount = amount;
            if (amount > maxBondAmount) maxBondAmount = amount;
        }
    }

    // Handle cases where bond amount is less than the minimum bond amount
    if (bondAmount < minBondAmount) {
        issue("Please insert an amount more than R" + numberWithCommas(minBondAmount));
        return;
        // return {
        //     fee: feesData.fees[0].fee,
        //     vat: feesData.fees[0].vat,
        //     total: feesData.fees[0].fee_plus_vat,
        //     deeds_office_charge: feesData.fees[0].deeds_office_charge,
        //     transfer_duty: feesData.fees[0].transfer_duty
        // };
    }

    // Handle cases where bond amount is greater than the maximum bond amount
    if (bondAmount > maxBondAmount) {
        const lastEntryIndex = feesData.fees.length - 1;
        // return {
        //     fee: feesData.fees[lastEntryIndex].fee,
        //     vat: feesData.fees[lastEntryIndex].vat,
        //     total: feesData.fees[lastEntryIndex].fee_plus_vat,
        //     deeds_office_charge: feesData.fees[lastEntryIndex].deeds_office_charge,
        //     transfer_duty: feesData.fees[lastEntryIndex].transfer_duty
        // };
        issue("Please insert an amount less than R" + numberWithCommas(maxBondAmount));
        return;
    }

    let closestLowerBound = -Infinity;
    let closestFees = null;

    for (const feeEntry of feesData.fees) {
        if (feeEntry.bond_amount_range.includes("-")) {
            const range = feeEntry.bond_amount_range.split("-");
            const lowerBound = parseFloat(range[0].replace(/,/g, ''));
            const upperBound = parseFloat(range[1].replace(/,/g, '')) || lowerBound;

            if (bondAmount >= lowerBound && bondAmount <= upperBound) {
                return {
                    fee: feeEntry.fee,
                    vat: feeEntry.vat,
                    total: feeEntry.fee_plus_vat,
                    deeds_office_charge: feeEntry.deeds_office_charge,
                    transfer_duty: feeEntry.transfer_duty
                };
            } else if (bondAmount > lowerBound && lowerBound > closestLowerBound) {
                closestLowerBound = lowerBound;
                closestFees = {
                    fee: feeEntry.fee,
                    vat: feeEntry.vat,
                    total: feeEntry.fee_plus_vat,
                    deeds_office_charge: feeEntry.deeds_office_charge,
                    transfer_duty: feeEntry.transfer_duty
                };
            }
        } else {
            const amount = parseFloat(feeEntry.bond_amount_range.replace(/,/g, ''));
            if (bondAmount >= amount && amount > closestLowerBound) {
                closestLowerBound = amount;
                closestFees = {
                    fee: feeEntry.fee,
                    vat: feeEntry.vat,
                    total: feeEntry.fee_plus_vat,
                    deeds_office_charge: feeEntry.deeds_office_charge,
                    transfer_duty: feeEntry.transfer_duty,
                };
            }
        }
    }
    
    return closestFees; // Return closest fees found
}





function getCostsFromFile() {
    var timestamp = new Date().getTime(); // Get current timestamp
    var data = $.ajax({
        type: 'GET',
        url: `costs.json?t=${timestamp}`, // Append timestamp as a query parameter
        async: false,
        dataType: "json",
        cache: false, // Disable jQuery's ajax cache
        success: function (data) {
            return data;
        },
        error: function (xhr, type, exception) {
            issue("Error reading from cost file");
        }
    });

    if (data.status === 200) {
        json = data.responseJSON;
        return json;
    }
}


function setResult(value)
{
    $("#result").html(value);
    $("#footernote").html(`<p class="responsive-font-table text-secondary fw-bold explanation" style=" font-style: italic;">
    <i>Please note that these fees are provided as a general guide and do not represent an exhaustive list of potential charges. For a precise calculation of all applicable costs, we recommend contacting our offices to request a detailed, formal quote.</i> <br>
    <i>It's important to note that your transaction may incur additional costs and disbursements beyond the fees listed above. These can include expenses for obtaining rates and levies information, Transfer Duty, Homeowners Association figures, FICA compliance, Conveyancers Certificates, Powers of Attorney, and various undertakings. Such extra expenses are not included in the initial estimate and will be added to the total cost. We recommend factoring in these potential additional expenses when budgeting for your transaction.</i>
    </p>`)
   // $("#result").addClass("light-border");
    $(".tabcontent").addClass("d-none");
}


const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const showAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
}


function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}


