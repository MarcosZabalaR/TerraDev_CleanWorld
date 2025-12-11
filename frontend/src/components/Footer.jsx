import { Link } from "react-router-dom";
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandInstagram,
  IconMail,
} from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="bg-brand-primary text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div>
            <h2 className="text-3xl font-medium mb-3">CleanWorld</h2>
            <p className="text-brand-light text-sm">
              Juntos por un planeta más limpio. Reporta, participa y haz la
              diferencia.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-3xl font-medium mb-3">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/map"
                  className="text-brand-light hover:text-white hover:underline text-xl"
                >
                  Mapa
                </Link>
              </li>
              <li>
                <Link
                  to="/zonas"
                  className="text-brand-light hover:text-white hover:underline text-xl"
                >
                  Zonas
                </Link>
              </li>
              <li>
                <Link
                  to="/eventos"
                  className="text-brand-light hover:text-white hover:underline text-xl"
                >
                  Eventos
                </Link>
              </li>
              <li>
                <Link
                  to="/map?report=true"
                  className="text-brand-light hover:text-white hover:underline text-xl"
                >
                  Reportar
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="text-3xl font-medium mb-3">Síguenos</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-brand-dark rounded-lg hover:bg-brand-light hover:text-brand-dark transition-colors"
              >
                <IconBrandTwitter size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-brand-dark rounded-lg hover:bg-brand-light hover:text-brand-dark transition-colors"
              >
                <IconBrandInstagram size={20} />
              </a>
              <a
                href="https://github.com/MarcosZabalaR/TerraDev_CleanWorld"
                className="p-2 bg-brand-dark rounded-lg hover:bg-brand-light hover:text-brand-dark transition-colors"
              >
                <IconBrandGithub size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-brand-dark rounded-lg hover:bg-brand-light hover:text-brand-dark transition-colors"
              >
                <IconMail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-3xl">¿Dónde estamos?</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.293316234903!2d-4.4225367!3d36.739529999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72f7003a823cb9%3A0x2a149fd29d27200e!2sFundaci%C3%B3n%20Esplai!5e0!3m2!1ses!2ses!4v1765275382502!5m2!1ses!2ses"
              className="w-70 h-64 md:h-70 rounded-lg"
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-brand-dark mt-8 pt-4 text-center text-sm text-brand-light">
          <p>
            CleanWorld somos:&nbsp;
            <a
              href="https://www.linkedin.com/in/franciscocortespirson/"
              className="hover:underline"
            >
              Francisco Cortés Pirson
            </a>
            ,&nbsp;
            <a
              href="https://www.linkedin.com/in/sergio-benitez-ramirez/"
              className="hover:underline"
            >
              Sergio Benítez Ramírez
            </a>
            ,&nbsp;
            <a
              href="https://www.linkedin.com/in/marcos-zabala/"
              className="hover:underline"
            >
              Marcos Zabala Rodríguez
            </a>
            ,&nbsp;
            <a
              href="https://www.linkedin.com/in/pablo-monís-álvarez-85087b253/"
              className="hover:underline"
            >
              Pablo Monís Álvarez
            </a>{" "}
          </p>
          <p>© 2025 CleanWorld. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
