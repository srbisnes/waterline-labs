import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  CircleCheck,
  Clock3,
  Copy,
  Download,
  FileUp,
  FileText,
  Menu,
  Package,
  Plus,
  QrCode,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

type Status = "En tránsito" | "Con incidencia" | "Entregado";
type EventKind = "Documento" | "Hito" | "Incidencia";
type CargoEvent = {
  id: string;
  title: string;
  detail: string;
  time: string;
  kind: EventKind;
};
type Shipment = {
  id: string;
  name: string;
  commodity: string;
  route: string;
  status: Status;
  reference: string;
  updated: string;
  createdAt: string;
  events: CargoEvent[];
};

function integrityCode(value: string) {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").toUpperCase();
}

const seededShipments: Shipment[] = [
  {
    id: "CP-2026-000184",
    name: "Soja — Rosario a Bahía Blanca",
    commodity: "Granos",
    route: "Rosario, Santa Fe → Bahía Blanca, Buenos Aires",
    status: "Con incidencia",
    reference: "TRZ-184-AR",
    updated: "Hace 18 min",
    createdAt: "15 Sep 2026 · 08:30",
    events: [
      {
        id: "1",
        title: "Carga registrada",
        detail: "Expediente creado por Martín López.",
        time: "15 Sep · 08:30",
        kind: "Hito",
      },
      {
        id: "2",
        title: "Documentación adjunta",
        detail: "Carta de porte.pdf · Factura comercial.pdf",
        time: "15 Sep · 09:10",
        kind: "Documento",
      },
      {
        id: "3",
        title: "Salida confirmada",
        detail: "Foto del vehículo y precinto adjuntadas.",
        time: "15 Sep · 11:45",
        kind: "Hito",
      },
      {
        id: "4",
        title: "Demora por corte de ruta",
        detail: "Operador notificó una demora estimada de 4 h.",
        time: "16 Sep · 14:20",
        kind: "Incidencia",
      },
    ],
  },
  {
    id: "CP-2026-000183",
    name: "Carbonato de litio — Jujuy a Antofagasta",
    commodity: "Minerales",
    route: "Susques, Jujuy → Antofagasta, Chile",
    status: "En tránsito",
    reference: "TRZ-183-AR",
    updated: "Hace 2 h",
    createdAt: "16 Sep 2026 · 07:40",
    events: [
      {
        id: "1",
        title: "Salida confirmada",
        detail: "Custodia y documentación verificadas.",
        time: "16 Sep · 07:40",
        kind: "Hito",
      },
    ],
  },
  {
    id: "CP-2026-000179",
    name: "Aceite de soja — San Lorenzo a Santos",
    commodity: "Derivados",
    route: "San Lorenzo, Santa Fe → Santos, Brasil",
    status: "Entregado",
    reference: "TRZ-179-AR",
    updated: "Ayer",
    createdAt: "14 Sep 2026 · 16:25",
    events: [
      {
        id: "1",
        title: "Entrega confirmada",
        detail: "Receptor firmó la recepción.",
        time: "14 Sep · 16:25",
        kind: "Hito",
      },
    ],
  },
];

function readShipments(): Shipment[] {
  try {
    const stored =
      JSON.parse(localStorage.getItem("cargoproof-shipments") ?? "null") ??
      seededShipments;
    return stored.map((shipment: Shipment) => ({
      ...shipment,
      createdAt: shipment.createdAt ?? "Registro histórico",
    }));
  } catch {
    return seededShipments;
  }
}

function App() {
  const [shipments, setShipments] = useState<Shipment[]>(readShipments);
  const [selectedId, setSelectedId] = useState(shipments[0]?.id ?? "");
  const [screen, setScreen] = useState<"home" | "dashboard">("home");
  const [modal, setModal] = useState<
    "create" | "event" | "share" | "delivery" | "none"
  >("none");
  const [notice, setNotice] = useState("");
  const selected =
    shipments.find((shipment) => shipment.id === selectedId) ?? shipments[0];

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setModal("none");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const stats = useMemo(
    () => ({
      active: shipments.filter((shipment) => shipment.status !== "Entregado")
        .length,
      issues: shipments.filter(
        (shipment) => shipment.status === "Con incidencia",
      ).length,
      files: shipments.reduce(
        (total, shipment) =>
          total +
          shipment.events.filter((event) => event.kind === "Documento").length,
        0,
      ),
    }),
    [shipments],
  );

  function persist(next: Shipment[]) {
    setShipments(next);
    try {
      localStorage.setItem("cargoproof-shipments", JSON.stringify(next));
    } catch {
      flash(
        "No se pudo guardar en este navegador. Liberá espacio e intentá nuevamente.",
      );
    }
  }
  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }
  function createShipment(form: HTMLFormElement) {
    const data = new FormData(form);
    const code = `CP-${new Date().getFullYear()}-${String(shipments.length + 185).padStart(6, "0")}`;
    const shipment: Shipment = {
      id: code,
      name: String(data.get("name")),
      commodity: String(data.get("commodity")),
      route: `${String(data.get("origin"))} → ${String(data.get("destination"))}`,
      status: "En tránsito",
      reference: `TRZ-${code.slice(-3)}-AR`,
      updated: "Ahora",
      createdAt: new Intl.DateTimeFormat("es-AR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date()),
      events: [
        {
          id: crypto.randomUUID(),
          title: "Carga registrada",
          detail: "Expediente creado desde CargoProof.",
          time: "Ahora",
          kind: "Hito",
        },
      ],
    };
    persist([shipment, ...shipments]);
    setSelectedId(shipment.id);
    setModal("none");
    setScreen("dashboard");
    flash("Expediente creado correctamente.");
  }
  function addEvent(form: HTMLFormElement) {
    if (!selected) return;
    const data = new FormData(form);
    const kind = String(data.get("kind")) as EventKind;
    const attachment = data.get("attachment");
    const attachedFile =
      attachment instanceof File && attachment.size > 0 ? attachment : null;
    const detail =
      String(data.get("detail")) || "Evento registrado desde el expediente.";
    const event: CargoEvent = {
      id: crypto.randomUUID(),
      title: String(data.get("title")),
      detail: attachedFile
        ? `${detail} · Archivo adjunto: ${attachedFile.name}`
        : detail,
      time: "Ahora",
      kind: attachedFile ? "Documento" : kind,
    };
    const next = shipments.map((shipment) =>
      shipment.id === selected.id
        ? {
            ...shipment,
            status:
              kind === "Incidencia"
                ? ("Con incidencia" as Status)
                : shipment.status,
            updated: "Ahora",
            events: [...shipment.events, event],
          }
        : shipment,
    );
    persist(next);
    setModal("none");
    flash(
      kind === "Incidencia"
        ? "Incidencia registrada y marcada para revisión."
        : "Evento agregado al expediente.",
    );
  }
  function downloadReport() {
    if (!selected) return;
    const rows = selected.events
      .map(
        (event) =>
          `<tr><td>${event.time}</td><td><strong>${event.title}</strong><br><small>${event.detail}</small></td><td>${event.kind}</td></tr>`,
      )
      .join("");
    const contents = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${selected.id} — CargoProof</title><style>body{font:15px Arial,sans-serif;color:#172b40;margin:48px;line-height:1.5}h1{margin:0 0 4px}small,p{color:#566676}table{width:100%;border-collapse:collapse;margin-top:28px}th,td{text-align:left;padding:12px;border-bottom:1px solid #dce4df;vertical-align:top}th{background:#edf5f0;font-size:11px;letter-spacing:.08em}footer{margin-top:32px;font-size:12px;color:#61726e}</style></head><body><p>CARGOPROOF · REPORTE DE EVIDENCIA</p><h1>${selected.name}</h1><p>Código: ${selected.id} · Estado: ${selected.status}<br>Ruta: ${selected.route}<br>Comprobante: ${selected.reference}</p><table><thead><tr><th>Momento</th><th>Evento</th><th>Tipo</th></tr></thead><tbody>${rows}</tbody></table><footer>Generado el ${new Date().toLocaleString("es-AR")} · CargoProof by elcryptoboy<br>Este reporte es una demostración operativa y no certifica una póliza, entrega ni derecho comercial.</footer></body></html>`;
    const href = URL.createObjectURL(
      new Blob([contents], { type: "text/html;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = href;
    link.download = `${selected.id}-reporte.html`;
    link.click();
    URL.revokeObjectURL(href);
    flash("Reporte descargado.");
  }
  function confirmDelivery() {
    if (!selected) return;
    const completed: CargoEvent = {
      id: crypto.randomUUID(),
      title: "Entrega confirmada",
      detail: "Entrega registrada por el operador responsable.",
      time: "Ahora",
      kind: "Hito",
    };
    persist(
      shipments.map((shipment) =>
        shipment.id === selected.id
          ? {
              ...shipment,
              status: "Entregado",
              updated: "Ahora",
              events: [...shipment.events, completed],
            }
          : shipment,
      ),
    );
    setModal("none");
    flash("Entrega confirmada y agregada al historial.");
  }
  async function copyShareLink() {
    const link = `https://cargoproof.app/e/${selected?.reference}-${selected ? integrityCode(selected.id) : ""}`;
    try {
      await navigator.clipboard.writeText(link);
      flash("Enlace copiado al portapapeles.");
    } catch {
      flash(
        "No se pudo copiar automáticamente. Seleccioná el enlace para copiarlo.",
      );
    }
  }

  return (
    <main>
      {notice && (
        <div className="toast">
          <CheckCircle2 size={18} />
          {notice}
        </div>
      )}
      <header className="topbar">
        <button className="brand" onClick={() => setScreen("home")}>
          <span className="brand-mark">
            <ShieldCheck size={20} />
          </span>
          Cargo<span>Proof</span>
        </button>
        <nav>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#para-quien">Para quién</a>
          <a href="#seguridad">Seguridad</a>
        </nav>
        <div className="header-actions">
          <button
            className="text-button"
            onClick={() => setScreen("dashboard")}
          >
            Ingresar
          </button>
          <button className="primary small" onClick={() => setModal("create")}>
            Crear expediente <ArrowRight size={16} />
          </button>
          <button
            className="mobile-menu"
            aria-label="Abrir demo de CargoProof"
            onClick={() => setScreen("dashboard")}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {screen === "home" ? (
        <>
          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow">
                <Sparkles size={15} /> Trazabilidad simple para cargas reales
              </p>
              <h1>
                La evidencia de tu carga,
                <br />
                <em>clara y en un solo lugar.</em>
              </h1>
              <p className="lead">
                Organizá fotos, documentos e incidencias en expedientes
                profesionales y compartibles. Hecho para logística, exportación
                y comercio exterior.
              </p>
              <div className="hero-actions">
                <button className="primary" onClick={() => setModal("create")}>
                  Crear expediente gratis <ArrowRight size={17} />
                </button>
                <button
                  className="secondary"
                  onClick={() => setScreen("dashboard")}
                >
                  Ver demo en vivo <ChevronRight size={17} />
                </button>
              </div>
              <p className="fine-print">
                Sin tarjeta · Datos de demostración · Hecho en Argentina
              </p>
            </div>
            <div className="hero-card">
              <div className="card-header">
                <div>
                  <p className="card-label">EXPEDIENTE ACTIVO</p>
                  <h3>Soja — Rosario a Bahía Blanca</h3>
                  <p>CP-2026-000184</p>
                </div>
                <span className="status issue">Con incidencia</span>
              </div>
              <div className="mini-route">
                <span>ROS</span>
                <div>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <span>BHI</span>
              </div>
              <div className="mini-event">
                <span className="event-icon warning">
                  <Clock3 size={17} />
                </span>
                <div>
                  <strong>Demora por corte de ruta</strong>
                  <small>Hace 18 minutos · evidencia adjunta</small>
                </div>
                <ChevronRight size={17} />
              </div>
              <div className="integrity">
                <ShieldCheck size={16} />
                <span>Integridad verificada</span>
                <code>TRZ-184-AR</code>
              </div>
            </div>
          </section>
          <section className="proof-strip">
            <span>Para quienes mueven el mundo real</span>
            <div>
              EXPORTADORES <b>·</b> LOGÍSTICA <b>·</b> PRODUCTORES <b>·</b>{" "}
              INSPECTORES <b>·</b> ASEGURADORAS
            </div>
          </section>
          <section className="features" id="como-funciona">
            <div className="section-heading">
              <p className="eyebrow">UNA HERRAMIENTA, TRES PASOS</p>
              <h2>
                De la carga a la evidencia,
                <br />
                sin perder el hilo.
              </h2>
            </div>
            <div className="feature-grid">
              <Feature
                icon={<Package />}
                number="01"
                title="Creá el expediente"
                text="Registrá una carga con su ruta, mercadería y responsables. Cada operación tiene un código único."
              />
              <Feature
                icon={<Upload />}
                number="02"
                title="Sumá la evidencia"
                text="Agregá fotos, documentos, hitos e incidencias desde cualquier dispositivo."
              />
              <Feature
                icon={<ClipboardCheck />}
                number="03"
                title="Compartí con confianza"
                text="Generá un enlace de solo lectura o un reporte para clientes, socios y auditorías."
              />
            </div>
          </section>
          <section className="security" id="seguridad">
            <div>
              <p className="eyebrow">
                <ShieldCheck size={15} /> INTEGRIDAD SIN COMPLEJIDAD
              </p>
              <h2>Cada archivo deja una huella.</h2>
              <p>
                CargoProof genera un comprobante de integridad para cada
                expediente. Así podés demostrar el orden y origen de tu
                evidencia sin pedirle a nadie que use tecnología complicada.
              </p>
              <button
                className="secondary light"
                onClick={() => setScreen("dashboard")}
              >
                Explorar un expediente <ArrowRight size={17} />
              </button>
            </div>
            <div className="hash-card">
              <span className="hash-label">COMPROBANTE DE INTEGRIDAD</span>
              <code>8f3a74c9 · 1d20a6e4 · 9bc038f1</code>
              <div>
                <CheckCircle2 size={18} />
                <span>Verificado · Archivo sin alteraciones</span>
              </div>
            </div>
          </section>
          <section className="cta" id="para-quien">
            <p className="eyebrow">LISTO PARA PROBAR</p>
            <h2>
              Tu próxima carga merece
              <br />
              <em>mejor evidencia.</em>
            </h2>
            <p>
              Creá tu primer expediente y comprobá cómo se ve una operación más
              ordenada.
            </p>
            <button className="primary" onClick={() => setModal("create")}>
              Empezar sin costo <ArrowRight size={17} />
            </button>
          </section>
        </>
      ) : (
        <section className="app-shell">
          <aside>
            <button
              className="new-expedition"
              onClick={() => setModal("create")}
            >
              <Plus size={18} /> Nuevo expediente
            </button>
            <p className="side-label">EXPEDIENTES</p>
            {shipments.map((shipment) => (
              <button
                className={`shipment-nav ${shipment.id === selected?.id ? "selected" : ""}`}
                key={shipment.id}
                onClick={() => setSelectedId(shipment.id)}
              >
                <Package size={18} />
                <span>
                  <strong>{shipment.name.split(" — ")[0]}</strong>
                  <small>{shipment.id}</small>
                </span>
                {shipment.status === "Con incidencia" && <i />}
              </button>
            ))}
            <div className="side-bottom">
              <button
                onClick={() =>
                  flash(
                    "No hay notificaciones pendientes en esta demostración.",
                  )
                }
              >
                <Bell size={17} /> Notificaciones
              </button>
              <button onClick={() => setScreen("home")}>
                ← Volver al inicio
              </button>
            </div>
          </aside>
          <div className="workspace">
            {selected && (
              <>
                <div className="breadcrumb">
                  Expedientes <ChevronRight size={14} />{" "}
                  <span>{selected.id}</span>
                </div>
                <div className="workspace-title">
                  <div>
                    <p className="eyebrow">
                      {selected.commodity.toUpperCase()}
                    </p>
                    <h2>{selected.name}</h2>
                    <p>{selected.route}</p>
                  </div>
                  <span
                    className={`status ${selected.status === "Con incidencia" ? "issue" : selected.status === "Entregado" ? "done" : ""}`}
                  >
                    {selected.status}
                  </span>
                </div>
                <div className="action-row">
                  <button
                    className="secondary"
                    onClick={() => setModal("event")}
                  >
                    <Plus size={17} /> Agregar evento
                  </button>
                  <button
                    className="secondary"
                    onClick={() => setModal("share")}
                  >
                    <QrCode size={17} /> Compartir
                  </button>
                  <button className="primary" onClick={downloadReport}>
                    <Download size={17} /> Descargar reporte
                  </button>
                  {selected.status !== "Entregado" && (
                    <button
                      className="secondary confirm-delivery"
                      onClick={() => setModal("delivery")}
                    >
                      <CircleCheck size={17} /> Confirmar entrega
                    </button>
                  )}
                </div>
                <div className="metrics">
                  <Metric
                    value={String(stats.active)}
                    label="Expedientes activos"
                  />
                  <Metric
                    value={String(stats.issues)}
                    label="Incidencias abiertas"
                    accent="red"
                  />
                  <Metric
                    value={String(stats.files)}
                    label="Documentos registrados"
                  />
                </div>
                <div className="content-grid">
                  <section className="timeline-panel">
                    <div className="panel-title">
                      <div>
                        <p className="eyebrow">TRAZABILIDAD</p>
                        <h3>Línea de tiempo</h3>
                      </div>
                      <span>{selected.events.length} eventos</span>
                    </div>
                    <div className="timeline">
                      {selected.events.map((event, index) => (
                        <div className="timeline-event" key={event.id}>
                          <div className={`dot ${event.kind.toLowerCase()}`}>
                            {event.kind === "Documento" ? (
                              <FileText size={15} />
                            ) : event.kind === "Incidencia" ? (
                              <Bell size={15} />
                            ) : (
                              <CheckCircle2 size={15} />
                            )}
                          </div>
                          {index < selected.events.length - 1 && (
                            <div className="line" />
                          )}
                          <div>
                            <small>{event.time}</small>
                            <strong>{event.title}</strong>
                            <p>{event.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      className="add-inline"
                      onClick={() => setModal("event")}
                    >
                      <Plus size={17} /> Registrar nuevo evento
                    </button>
                  </section>
                  <aside className="detail-panel">
                    <p className="eyebrow">VERIFICACIÓN</p>
                    <div className="verification">
                      <ShieldCheck size={26} />
                      <div>
                        <strong>Expediente íntegro</strong>
                        <p>Sin modificaciones detectadas</p>
                      </div>
                    </div>
                    <dl>
                      <div>
                        <dt>Código de verificación</dt>
                        <dd>
                          {selected.reference}-{integrityCode(selected.id)}
                        </dd>
                      </div>
                      <div>
                        <dt>Última actualización</dt>
                        <dd>{selected.updated}</dd>
                      </div>
                      <div>
                        <dt>Acceso externo</dt>
                        <dd>
                          <span className="access">Listo para compartir</span>
                        </dd>
                      </div>
                    </dl>
                    <button
                      className="copy-link"
                      onClick={() => setModal("share")}
                    >
                      <Copy size={16} /> Copiar enlace de acceso
                    </button>
                  </aside>
                </div>
              </>
            )}
          </div>
        </section>
      )}
      <footer>
        <span>© {new Date().getFullYear()} CargoProof</span>
        <span>
          Construido con propósito · <b>by elcryptoboy</b>
        </span>
      </footer>
      {modal === "create" && (
        <Modal title="Crear un expediente" close={() => setModal("none")}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              createShipment(event.currentTarget);
            }}
          >
            <label>
              Nombre de la carga
              <input
                name="name"
                required
                placeholder="Ej. Maíz — Córdoba a Rosario"
              />
            </label>
            <div className="form-row">
              <label>
                Mercadería
                <select name="commodity">
                  <option>Granos</option>
                  <option>Minerales</option>
                  <option>Derivados</option>
                  <option>Equipamiento</option>
                </select>
              </label>
              <label>
                Fecha de salida
                <input name="date" type="date" required />
              </label>
            </div>
            <label>
              Origen
              <input name="origin" required placeholder="Ciudad, Provincia" />
            </label>
            <label>
              Destino
              <input
                name="destination"
                required
                placeholder="Ciudad, Provincia"
              />
            </label>
            <button className="primary full" type="submit">
              Crear expediente <ArrowRight size={17} />
            </button>
          </form>
        </Modal>
      )}
      {modal === "event" && (
        <Modal title="Registrar un evento" close={() => setModal("none")}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              addEvent(event.currentTarget);
            }}
          >
            <label>
              Tipo de evento
              <select name="kind">
                <option>Hito</option>
                <option>Documento</option>
                <option>Incidencia</option>
              </select>
            </label>
            <label>
              Título
              <input
                name="title"
                required
                placeholder="Ej. Inspección de carga completada"
              />
            </label>
            <label>
              Detalle
              <textarea
                name="detail"
                placeholder="Agregá información útil para el expediente."
                rows={3}
              />
            </label>
            <label className="file-input">
              <FileUp size={17} /> Adjuntar archivo
              <input
                name="attachment"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
              />
              <small>
                Se registrará el nombre del archivo en el historial. El
                almacenamiento seguro se conecta en la siguiente fase.
              </small>
            </label>
            <button className="primary full" type="submit">
              Guardar evento <CheckCircle2 size={17} />
            </button>
          </form>
        </Modal>
      )}
      {modal === "share" && (
        <Modal title="Compartir expediente" close={() => setModal("none")}>
          <div className="share-modal">
            <div className="fake-qr">
              <QrCode size={104} />
            </div>
            <p>
              Generá un enlace de demostración en modo solo lectura para
              compartir el expediente con un tercero.
            </p>
            <div className="share-link">
              <code>
                cargoproof.app/e/{selected?.reference}-
                {selected ? integrityCode(selected.id) : ""}
              </code>
              <button
                aria-label="Copiar enlace de acceso"
                onClick={copyShareLink}
              >
                <Copy size={17} />
              </button>
            </div>
            <button
              className="primary full"
              onClick={() => {
                setModal("none");
                flash("Acceso compartible activado.");
              }}
            >
              Listo, compartir acceso <ArrowRight size={17} />
            </button>
          </div>
        </Modal>
      )}
      {modal === "delivery" && (
        <Modal title="Confirmar entrega" close={() => setModal("none")}>
          <div className="confirmation-modal">
            <CircleCheck size={34} />
            <p>
              Vas a registrar la entrega de <strong>{selected?.name}</strong>.
              Esta acción agrega un evento al historial y actualiza el estado
              del expediente.
            </p>
            <div className="modal-actions">
              <button className="secondary" onClick={() => setModal("none")}>
                Cancelar
              </button>
              <button className="primary" onClick={confirmDelivery}>
                Confirmar entrega
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

function Feature({
  icon,
  number,
  title,
  text,
}: {
  icon: ReactNode;
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className="feature">
      <span className="feature-number">{number}</span>
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <button
        onClick={() =>
          document.querySelector(".cta")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        Conocer más <ArrowRight size={15} />
      </button>
    </article>
  );
}
function Metric({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: string;
}) {
  return (
    <div className={`metric ${accent ?? ""}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
function Modal({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: ReactNode;
}) {
  const titleId = "modal-title";
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <h3 id={titleId}>{title}</h3>
          <button aria-label="Cerrar" onClick={close}>
            <X size={20} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

export default App;
